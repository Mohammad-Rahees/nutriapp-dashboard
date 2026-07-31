const express = require("express");
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.put("/:id/status", updateOrderStatus);
router.put("/:id", updateOrderStatus);

module.exports = router;
