const express = require("express");
const router = express.Router();
const {
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/mealController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
  .get(getMeals)
  .post(createMeal);

router.route("/:id")
  .get(getMealById)
  .put(updateMeal)
  .delete(deleteMeal);

module.exports = router;
