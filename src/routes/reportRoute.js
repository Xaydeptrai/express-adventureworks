const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get(
  "/:server/report/bySubcategory",
  reportController.getSalesBySubcategory
);

router.get(
  "/:server/report/totalSalesByYear",
  reportController.totalSalesByYearAndMonth
);

router.get(
  "/:server/report/customersByRevenue",
  reportController.getCustomersByRevenue
);

module.exports = router;
