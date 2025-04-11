const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:server/products", productController.getProducts);

module.exports = router;
