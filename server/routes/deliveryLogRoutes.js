const express = require("express");
const router = express.Router();
const {
  getDeliveryStats,
  getDeliveryHistory,
  getMyLogs,
  getAdminLogs,
  getLogDetails,
} = require("../controllers/deliveryLogController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/stats", protect, authorize("Delivery", "Admin"), getDeliveryStats);
router.get("/history", protect, authorize("Delivery", "Admin"), getDeliveryHistory);
router.get("/my-logs", protect, authorize("Delivery"), getMyLogs);
router.get("/admin", protect, authorize("Admin"), getAdminLogs);
router.get("/:id", protect, authorize("Delivery", "Admin"), getLogDetails);

module.exports = router;
