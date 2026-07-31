const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  createRetryRazorpayOrder,
  verifyRetryPayment,
} = require("../controllers/paymentController");

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);
router.post("/retry-payment", createRetryRazorpayOrder);
router.post("/verify-retry-payment", verifyRetryPayment);

module.exports = router;
