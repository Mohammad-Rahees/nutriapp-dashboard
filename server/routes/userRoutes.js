const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  createDeliveryUser,
  updateUserById,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/roleMiddleware");

router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/delivery")
  .post(protect, admin, createDeliveryUser);

router.route("/")
  .get(protect, admin, getUsers);

router.route("/:id")
  .put(protect, admin, updateUserById)
  .delete(protect, admin, deleteUser);

module.exports = router;
