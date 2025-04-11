const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/:server/order", orderController.getOrders);
router.get("/:server/order/:orderId", orderController.getOrderDetail);

module.exports = router;
