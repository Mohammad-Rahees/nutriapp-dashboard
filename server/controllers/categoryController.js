const Category = require("../models/Category");

const initialCategories = [
  { name: "Breakfast", description: "Energizing morning meals and bowls", icon: "Coffee" },
  { name: "Lunch", description: "Satisfying salads, wraps and sandwiches", icon: "UtensilsCrossed" },
  { name: "Dinner", description: "Nutritious main courses and protein plates", icon: "Utensils" },
  { name: "Snack", description: "Healthy bites and quick refreshments", icon: "Apple" },
  { name: "Vegan", description: "Plant-based delicious dishes", icon: "Leaf" },
  { name: "Dessert", description: "Guilt-free sweet treats", icon: "Cookie" },
  { name: "Beverage", description: "Refreshing smoothies and drinks", icon: "CupSoda" },
];

// @desc    Get all categories (auto-seeds if empty)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find({});
    if (categories.length === 0) {
      categories = await Category.insertMany(initialCategories);
    }
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Public/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.json(categoryExists);
    }
    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};
