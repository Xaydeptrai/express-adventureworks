const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/:server/order", orderController.getOrders);

module.exports = router;
