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
async function getShippingInfo(customerId) {
    const shipping = await query("select * from shipping where Customer_Id = ?",
        [customerId,]
    );
    return shipping;
}
function calcShippingCost(shippingRegion) {
    let ship_cost ;
    if (shippingRegion === "cairo") {
        ship_cost = 50;
    } else if(shippingRegion === "alex"){
        ship_cost = 100;
    }
    else {
        ship_cost = 150;
    }
    return ship_cost;
}
async function handleAddShippingInfo(req, res) {
    try {

        //prepare shipping cost
        const ship_cost = calcShippingCost(req.body.Shipping_Region_Name);

        //prepare shipping object
        const shipping = {
            Customer_Id: req.params.customerId,
            Shipping_Cost: ship_cost,
            Shipping_Region_Name: req.body.Shipping_Region_Name,
        }

        //insert shipping into db
        await query("insert into shipping set ? ", shipping);
        res.status(200).json({
            msg: "shipping info added successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
async function handleUpdateShippingInfo(req, res) {
    try {

        //check if shipping info exist
        const shipping = await getShippingInfo(req.params.customerId);
        if ( !shipping[0] ) {
            return res.status(404).json({
                errors: [{
                    msg: "you have not add shipping info yet !"
                }]
            })
        }

        //calc shipping cost
        const ship_cost = calcShippingCost(req.body.Shipping_Region_Name)

        //prepare shipping object
        const shippingObj = {
            Customer_Id: req.params.customerId,
            Shipping_Cost: ship_cost,
            Shipping_Region_Name: req.body.Shipping_Region_Name,
        }

        //update shipping in db
        await query("update shipping set ? where Shipping_Id = ?", [shippingObj, shipping[0].Shipping_Id]);
        // update shipping info for unPayed order 
        await query("update `order` set Shipping_Region = ?, Shipping_Cost = ? where Customer_Id = ? AND Status = 0",
            [shippingObj.Shipping_Region_Name, shippingObj.Shipping_Cost, shippingObj.Customer_Id,])
        
        res.status(200).json({
            msg: "SHIPPING INFO UPDATED successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ================== Add Shipping Info =============== //
router.post("/addShippingInfo/:customerId",
    authorized,[
        body("Shipping_Region_Name")
            .isString()
            .withMessage("Please enter a valid shipping region name"), validateProductRequest
    ], handleAddShippingInfo);
    
// ================== Update Shipping Info =============== //
router.put("/updateShippingInfo/:customerId",
    authorized,[
        body("Shipping_Region_Name")
            .isString()
            .withMessage("Please enter a valid shipping region name"), validateProductRequest
    ], handleUpdateShippingInfo);

module.exports = router;