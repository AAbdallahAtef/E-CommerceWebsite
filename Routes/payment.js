const router = require('express').Router();
const conn = require("../Db/DbConnection");
const authorized = require("../Middleware/Authorize")
const { body, validationResult} = require('express-validator');
const util = require("util");
const query = util.promisify(conn.query).bind(conn);

function validateProductRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
function calculatePaymentAmount(order) {
    const totalPriceWithShipping = parseFloat(order[0].Order_Price) + parseFloat(order[0].Shipping_Cost);
    return totalPriceWithShipping;
}
async function getOrder(customerId) {
    const order = await query("select * from  `order` where Customer_Id = ? AND  Status = 0",
        [customerId,]
    );
    return order;
}
async function updateOrderStatus(orderId) {
    await query("update `order` set Status = 1 where Order_Id = ?", [orderId]);
}
async function getCart(customerId) {
    const cart = await query("select * from cart where Customer_Id = ?",
        [customerId,]
    );
    return cart;
}
async function clearCart(customerId) {
        //delete user's cart from db
        const cart = await getCart(customerId)
        await query("delete from cart_details where Cart_Id = ?", [cart[0].Cart_Id,]);
}
async function handlePaymentByCash(req, res) {
    try {
        //get data for payment info
        const order = await getOrder(req.params.customerId);
        const paymentAmount = calculatePaymentAmount(order);

        //prepare payment obj
        const paymentCashObj = {
            Customer_Id: req.params.customerId,
            Order_Id: order[0].Order_Id,
            Payment_Amount: paymentAmount,
        };
        //insert payment in db 
        await query("insert into payment_by_cash set ? ", [paymentCashObj,]); 
        //update unPayed order
        await updateOrderStatus(order[0].Order_Id);
        //clear customer's cart
        await clearCart(req.params.customerId);
        res.status(200).json({
            msg: "payment added successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handlePaymentByCredit(req, res) {
    try {
        
        //get data for payment info
        const order = await getOrder(req.params.customerId);
        const paymentAmount = calculatePaymentAmount(order);
        
        //prepare payment obj
        const paymentCreditObj = {
            Customer_Id: req.params.customerId,
            Order_Id: order[0].Order_Id,
            Card_Number: req.body.Card_Number,
            Card_Tybe: req.body.Card_Tybe,
            Payment_Amount: paymentAmount,
            Exp_Date: req.body.Exp_Date,
        };
        
        //insert payment in db
         await query("insert into payment_by_credit set ? ", [paymentCreditObj,]); 
         //update unPayed order
         await updateOrderStatus(order[0].Order_Id);
         //clear customer's cart
         await clearCart(req.params.customerId);
        res.status(200).json({
            msg: "payment added successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ================== Pay By Cash =============== //
router.post("/paymentByCash/:customerId", authorized, handlePaymentByCash);

// ================== Pay By Credit =============== //
router.post("/paymentByCredit/:customerId", authorized, [
    body("Card_Number")
        .isNumeric()
        .withMessage("Please enter a valid Card Number")
        .isLength({min:16, max: 16})
        .withMessage("card no should be 16 digit"),
    body("Card_Tybe")
        .isString()
        .withMessage("Please enter a valid Card Tybe"),
    body("Exp_Date")
        .isString()
        .withMessage("Please enter a valid Exp Date"), validateProductRequest
], handlePaymentByCredit);

module.exports = router;
