// ============= Intialize Express app =============//
const express = require('express');
const app = express();

// ============= Global Middleware =============//
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //acces url form encoded
app.use(express.static('Upload'));
const cors = require("cors");
app.use(cors()) // allow front to call backend

// ============= Require Module =============//
const auth = require("./Routes/Authentication");
const carts = require("./Routes/Carts");
const orders = require("./Routes/Orders");
const products = require("./Routes/Products");
const payment = require("./Routes/payment");
const shipping = require("./Routes/Shipping");

// ============= Run the App =============//
app.listen(8888, "localhost", () => {
    console.log("Server is Runing!");

})

// ============= API Routes =============//
app.use("/auth", auth);
app.use("/carts", carts);
app.use("/orders", orders);
app.use("/products", products);
app.use("/payment", payment);
app.use("/shipping", shipping);