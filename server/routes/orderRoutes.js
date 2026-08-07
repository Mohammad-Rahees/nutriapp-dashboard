const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  updateOrderStatus, 
  assignDeliveryPerson, 
  updateDeliveryStatus 
} = require("../controllers/orderController");

router.route("/")
  .get(getOrders)
  .post(createOrder);

router.put("/:id/assign", assignDeliveryPerson);
router.put("/:id/delivery-status", updateDeliveryStatus);
router.put("/:id/status", updateOrderStatus);
router.put("/:id", updateOrderStatus);

module.exports = router;
