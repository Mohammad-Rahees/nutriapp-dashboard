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
  .post(createFood);

router.route("/:id")
  .get(getFoodById)
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;
