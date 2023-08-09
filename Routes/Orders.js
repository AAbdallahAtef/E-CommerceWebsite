const router = require('express').Router();
const conn = require("../Db/DbConnection");
const authorized = require("../Middleware/Authorize")
const { body, validationResult} = require('express-validator');
const util = require("util");
const query = util.promisify(conn.query).bind(conn);

async function calcTotalOrderPrice(cart) {
    const result = await query(`select SUM(cart_details.Total_Price) AS order_price 
        from cart_details
        where Cart_Id = ? `,
        [cart[0].Cart_Id,]
    );
    return result;
}
async function getUnPayedOrder(customerId) {
    const order = await query("select * from  `order` where Customer_Id = ? AND Status = 0",
        [customerId,]
    );
    return order;
}
async function getOrder(customerId) {
    const order = await query("select * from  `order` where Customer_Id = ?",
        [customerId,]
    );
    return order;
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
async function getShippingInfo(customerId) {
    const shipping = await query("select * from shipping where Customer_Id = ?",
        [customerId,]
    );
    return shipping;
}
async function handlePlaceOrder(req, res){
    try {

        //check that user's cart  not empty
        const cartDetails = await getCartDetails(req.params.customerId);
        if ( !cartDetails[0] ) {
         return res.status(404).json({
             errors: [{
                 msg: "your cart is empty !"
             }]
         })
        }

        //check that user add his shipping info
        const shipping = await getShippingInfo(req.params.customerId);
        if ( !shipping[0] ) {
            return res.status(404).json({
                errors: [{
                    msg: "Please add your shipping info firstly"
                }]
            })
        }
        
        //calculate  Total order  price 
        const result = await calcTotalOrderPrice(cartDetails);
        
        //prepare order obj
        const orderObj = {
            Customer_Id: req.params.customerId,
            Order_Price: result[0].order_price,
            Shipping_Region: shipping[0].Shipping_Region_Name,
            Shipping_Cost: shipping[0].Shipping_Cost,
        }

        // insert  order in db
        await query("insert into `order` set ? ", [orderObj,]);
        
        res.status(200).json({
            msg: "order created successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleCancelOrder(req, res) {
    try {
        //check if order  exist
        const order = await getUnPayedOrder(req.params.customerId);

        if ( !order[0] ) {
            return res.status(404).json({
                errors: [{
                    msg: "order not found  or order has been paid"
                }]
            })
        }

        //delete order from db
        await query("delete from `order` where Customer_Id = ? AND Status = 0",
            [order[0].Customer_Id,]
        );
        res.status(200).json({
            msg: "Order deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleViewOrders(req, res) {
    try {
        //check if order  exist
        const order = await getOrder(req.params.customerId);

        if (!order[0]) {
            return res.status(404).json({
                errors: [{
                    msg: "you dont have orders !"
                }]
            })
        }
        //Display order details
        order.map((order) => { });
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ================== Place Order =============== //
router.post("/placeOrder/:customerId", authorized, handlePlaceOrder);

// ================== Cancel Order =============== //
router.delete("/cancelOrder/:customerId", authorized, handleCancelOrder);

// ================== Display User Orders List =============== //
router.get("/getOrderDetails/:customerId", authorized, handleViewOrders);

module.exports = router;