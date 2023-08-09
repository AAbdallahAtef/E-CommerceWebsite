const router = require('express').Router();
const conn = require("../Db/DbConnection");
const authorized = require("../Middleware/Authorize")
const { body, validationResult} = require('express-validator');
const util = require("util");
const upload = require("../Middleware/UploadImages");
const query = util.promisify(conn.query).bind(conn);
const now = new Date();

function validateProductRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
async function getCart(customerId) {
    const cart = await query("select * from cart where Customer_Id = ?",
        [customerId,]
    );
    return cart;
}
async function getCartDetails(customerId) {
    const cart = await getCart(customerId);
    const cartDetails = await query("select * from  cart_details where Cart_Id = ?",
        [cart[0].Cart_Id,]
    );
    return cartDetails;
}
async function createCart(customerId) {
    const cartObj = {
        Customer_Id: customerId,
        Date_Placed: now,
    }
    await query("insert into cart set ? ", [cartObj,]); 
}
async function productExist(customerId, productId) {
    const cart = await getCart(customerId);
    const productInCart = await query("select * from cart_details where Cart_Id = ? AND Product_Id = ?",
        [cart[0].Cart_Id, productId,]
    );
    return productInCart;
}
async function getPrice(productId) {
    const product = await query("select * from product where Id = ?  ", [productId,]);
    return product[0].Price;
}
async function calcTotalPrice(price, Quantity) {
    const totalPrice = price * Quantity;
    return totalPrice;
}
async function updateQuantity(productInCart, Quantity) {
    const oldQuantity = parseInt(productInCart[0].Quantity);
    const newQuantity = oldQuantity + parseInt(Quantity);

    await query("update cart_details set Quantity = ? where Cart_Id = ? AND Product_Id = ?",
    [newQuantity, productInCart[0].Cart_Id, productInCart[0].Product_Id,]
    );
    return newQuantity;
}
async function updateTotalPrice(productInCart, newQuantity) {

    const piecePrice = parseFloat(await getPrice(productInCart[0].Product_Id)) ;
    const totalPrice = await calcTotalPrice(piecePrice, newQuantity);

    await query("update cart_details set Total_Price = ? where Cart_Id = ? AND Product_Id = ?",
    [totalPrice, productInCart[0].Cart_Id, productInCart[0].Product_Id,]
    );
}
async function handleAddPrductToCart(req, res) {
    try {
    
        //chech if customer has cart
        const cartExist = await getCart(req.params.customerId);
        
        if (!cartExist[0]) {
           await createCart(req.params.customerId)
        }
        
        //check if product exist in cart and update it
        const productInCart = await productExist(req.params.customerId, req.body.Product_Id); 
        
        if (productInCart[0]) {
            
            //update Quantity
            const newQuantity = await updateQuantity(productInCart, req.params.Quantity);
            
            //update Price
            await updateTotalPrice(productInCart, newQuantity);
            
            return res.status(200).json({
                msg: "product added to cart successfully",
            });
        }

        //GET info for cart
        const cart = await getCart(req.params.customerId);
        const piecePrice = parseFloat(await getPrice(req.body.Product_Id));
        const totalPrice = await calcTotalPrice(piecePrice, parseInt(req.body.Quantity));

        //prepare cart object
        const cartDetailstObj = {
            Cart_Id: cart[0].Cart_Id,
            Product_Id: req.body.Product_Id,
            Quantity: req.body.Quantity,
            Piece_Price: piecePrice,
            Total_Price: totalPrice,
            Date_added: now,
        }

        //add product to cart db        
        await query("insert into cart_details set ? ", [cartDetailstObj,]);
        
        res.status(200).json({
            msg: "product added to cart successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleDeleteProductFromCart(req, res) {
    try {
        
        //check if product  exist
        const product = await productExist(req.params.customerId, req.body.Product_Id)
        
        if (!product[0]) {
            return res.status(404).json({
                errors: [{
                    msg: "product not found !"
                }]
            })
        }
        
        //delete product from cart_details db
        await query("delete from cart_details where Cart_Details_Id = ?",
            [product[0].Cart_Details_Id]
        );
        
        res.status(200).json({
            msg: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleClearCustomersCart(req, res) {
    try {
        //delete user's cart from db
        const cart = await getCart(req.params.customerId)
        await query("delete from cart_details where Cart_Id = ?", [cart[0].Cart_Id,]);
        
        res.status(200).json({
            msg: "user's car deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleGetCartDetails(req, res) {
    try{
            
        //get Products from cart 
        const cartDetails = await getCartDetails(req.params.customerId);
        //check that cart is not empy
        if (!cartDetails[0]) {
            return res.status(404).json({
                errors: [{
                    msg: "please add product to cart firstly !"
                }]
            })
        }
        
        //print the cart's product
        cartDetails.map((cartDetails) => {
            delete cartDetails.Cart_Details_Id;
            delete cartDetails.Date_added;
        });
        
        res.status(200).json(cartDetails);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

// ================== Add Product To Cart =============== //
router.post("/addProductToCart/:customerId",
    authorized, [
    body("Product_Id")
        .isNumeric()
        .withMessage("Please enter a valid product Id"),
    body("Quantity")
        .isNumeric()
        .withMessage("Please enter a valid Quantity"), validateProductRequest
    ], handleAddPrductToCart);
    
// ================== Delete Product From Cart =============== //
router.delete("/deleteProductFromCart/:customerId",
    authorized, [
    body("Product_Id")
        .isNumeric().withMessage("please enter valid product id"), validateProductRequest
], handleDeleteProductFromCart);

// ================== Clear User's Cart =============== //
router.delete("/clearCustomer'sCart/:customerId", authorized, handleClearCustomersCart);

// ================== Display Cart's Product =============== //
router.get("/getCartDetails/:customerId", authorized, handleGetCartDetails);

module.exports = router;