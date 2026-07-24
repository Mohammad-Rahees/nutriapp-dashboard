const express = require("express");
const router = express.Router();
const {
  getDailyLog,
  createOrUpdateDailyLog,
  getLogSummary,
  deleteLog,
} = require("../controllers/logController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/daily", getDailyLog);
router.post("/daily", createOrUpdateDailyLog);
router.get("/summary", getLogSummary);
router.delete("/:id", deleteLog);

module.exports = router;
