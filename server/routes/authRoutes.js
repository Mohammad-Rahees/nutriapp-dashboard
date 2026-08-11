const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", updateUserProfile);

module.exports = router;
