const express = require("express");
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  seedFoods,
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");

router.post("/seed", seedFoods);

router.route("/")
  .get(getFoods)
  .post(protect, createFood);

router.route("/:id")
  .get(getFoodById)
  .put(protect, updateFood)
  .delete(protect, deleteFood);

module.exports = router;
