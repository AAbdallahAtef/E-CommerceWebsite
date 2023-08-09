const router = require('express').Router();
const conn = require("../Db/DbConnection");
const authorized = require("../Middleware/Authorize");
const admin = require("../Middleware/Admin");
const { body, validationResult } = require('express-validator');
const upload = require("../Middleware/UploadImages");
const util = require("util");
const query = util.promisify(conn.query).bind(conn);
const fs = require("fs");

function validateProductRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
async function productExist(productName) {
      const product = await query("SELECT * FROM product WHERE name = ?", [productName]);
      return product;
}
async function removeImage(imageUrl) {
      fs.unlinkSync("./upload/" +  imageUrl);
}
async function getProduct(productId) {
    const product = await query("select * from product where Id = ?",
        [productId,]
    );
    return product;
}
async function productWithSameName(productname, productId) {
    const checkProductExist = await query("select * from product where name = ? AND Id != ?",
        [productname, productId])
    return checkProductExist;
}
async function handleAddProduct(req, res) {
    try {
       const product = await productExist(req.body.name)
    if (product.length > 0) {
      removeImage(req.file.filename);
      return res.status(400).json({
        errors: [{
          "msg": "product already exists!"
        }]
      })
    }
    //check image is added
    if (!req.file) {
        return res.status(400).json({
            errors: [
                {
                    msg: "image is required",
                },
            ],
        });
    }

    //prepare product object
    const productObj = {
        name: req.body.name,
        Description: req.body.Description,
        price: req.body.Price,
        Image_url: req.file.filename,
    }

    await query("INSERT INTO product SET ? ", productObj);
    res.status(200).json({
      msg: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
async function handleUpdateProduct(req, res) {
  try {
    const product = await getProduct(req.params.productId);
    if (!product) {
      removeImage(req.file.filename);
      return res.status(404).json({
        errors: [{
          msg: "product not found!"
        }]
      });
      }
       //check if there product with the updated product name
      const checkProductExist = await productWithSameName(req.body.name, req.params.productId);
    if (checkProductExist.length > 0) {
       if (req.file) {
           removeImage(req.file.filename);
       }
       return res.status(400).json({
           errors: [{
               "msg": "there is a product with same name"
           }]
       })
   }

   //prepare product object
   const productObj = {
       name: req.body.name,
       Description: req.body.Description,
       price: req.body.Price,
      }
      
    if (req.file) {
        removeImage(product[0].Image_url);
        productObj.Image_url = req.file.filename;
       
    }
      await query("UPDATE product SET ? WHERE Id = ?", [productObj, product[0].Id]);
      
    res.status(200).json({
      msg: "Product UPDATED successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
async function handleDeleteProduct(req, res) {
    try {
        const product = await getProduct(req.params.productId);
        if (!product) {
            return res.status(404).json({
                errors: [{
                    msg: "product not found!"
                }]
            });
        }
        removeImage(product[0].Image_url);
        await query("DELETE FROM product WHERE Id = ?", [product[0].Id]);
        res.status(200).json({
            msg: "Product DELETED successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status
    }
}
async function handleViewProduct(req, res) {
    try {
        //get all products
        const product = await query("select * from product");
        
        //adjust image url and print products
        product.map((product) => {
            product.Image_url = "http://" + req.hostname + ":8888/" + product.Image_url;
        });
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ================== Add Product =============== //
router.post("/addProduct", admin, [upload.single("image"),
    body("name")
        .isString()
        .withMessage("Please enter a valid product name")
        .isLength({ min: 2 })
        .withMessage("Product name should be at least 2 character"),
    body("Description")
        .isString()
        .withMessage("Please enter a valid product Description")
        .isLength({ min: 10 })
        .withMessage("Product Description should be at least 10 character"),
    body("Price")
        .isNumeric()
        .withMessage("Please enter a valid product Price")
        .isLength({ min: 2 })
        .withMessage("Product Price should be at least 2 character"), validateProductRequest
], handleAddProduct);

// ================== Update Product =============== //
router.put("/updateProduct/:productId",
    admin,
    [upload.single("image"),
        body("name")
            .isString()
            .withMessage("Please enter a valid product name")
            .isLength({ min: 2 })
            .withMessage("Product name should be at least 2 character"),
        body("Description")
            .isString()
            .withMessage("Please enter a valid product Description")
            .isLength({ min: 10 })
            .withMessage("Product Description should be at least 10 character"),
        body("Price")
            .isNumeric()
            .withMessage("Please enter a valid product Price")
            .isLength({ min: 2 })
            .withMessage("Product Price should be at least 2 character"), validateProductRequest
    ], handleUpdateProduct);

// ================== Delete Product =============== //
router.delete("/deleteProduct/:productId", admin, handleDeleteProduct);

// ================== Display Product List =============== //
router.get("/viewProducts", handleViewProduct);

module.exports = router;
