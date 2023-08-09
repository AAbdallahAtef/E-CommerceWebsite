const router = require('express').Router();
const conn = require("../Db/DbConnection");
const { body, validationResult } = require('express-validator');
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// ================== Register =============== //
router.post("/register",
    body("email").isEmail().withMessage("Please Enter a valid Email!"),

    body("name").isString().withMessage("Please Enter a valid name!")
        .isLength({ min: 6, max: 40 }).withMessage("Enter your second name!"),

    body("password").isLength({ min: 8 }).withMessage("Please Enter a password more than 8 character!"),

    body("PhoneNumber").isNumeric().withMessage("PhoneNumber should be number")    
        .isLength({ length: 11 }).withMessage("PhoneNumber should be  11 number"),
    
    body("Address").isString().withMessage("please enter a valid Address")
        .isLength({ min: 10 }).withMessage("Address should be more than 10 character"),
    async (req, res) => {
        try {
            // //-validation request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //-check if email exist using await and async
            const query = util.promisify(conn.query).bind(conn); //transform query mysql -> promisify to use await and async

            const checkEmailExist = await query("select * from Customer where email = ?",
                [req.body.email]
            );
            if (checkEmailExist.length > 0) {
                return res.status(400).json({
                    errors: [{
                        "msg": "email already exist!"
                    }]
                })
            }

            //-prepare cust object to be saved
            const custObject = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 16),
                PhoneNumber: req.body.PhoneNumber,
                Address: req.body.Address,
                token: crypto.randomBytes(16).toString('hex'),  //crypto to make a random encryption standard
            };

            //-insert user object to db
            await query("insert into customer set ?", custObject);
            delete custObject.password;
            res.status(200).json(custObject);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
);

// ================= LOGIN ================= //
router.post("/login",
    body("email").isEmail().withMessage("Please Enter a valid Email!"),

    body("password").isLength({ min: 8 }).withMessage("Please Enter a password more than 8 character!"),

    async (req, res) => {
        try {
            //-validation request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //-check if email exist using await and async
            const query = util.promisify(conn.query).bind(conn);
            const customer = await query("select * from customer where email = ?", [req.body.email]);

            if (customer.length === 0) {
                return res.status(404).json({
                    errors: [{ "msg": "Invalid email " }]
                });
            }

            //-compare password
            if (await bcrypt.compare(req.body.password, customer[0].Password)) {
                delete customer[0].Password;
                res.status(200).json(customer[0]);
            } else {
                res.status(404).json({
                    errors: [{ msg: "Invalid password" }]
                });
            }
        }
        catch (error) {
            console.error(error);
            
            return res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;