const Meal = require("../models/Meal");
const Food = require("../models/Food");

// @desc    Get user's meals
// @route   GET /api/meals
// @access  Private
const getMeals = async (req, res, next) => {
  try {
    const { mealType, category, date } = req.query;
    let query = { user: req.user._id };

    const typeFilter = mealType || category;
    if (typeFilter) {
      query.$or = [{ mealType: typeFilter }, { category: typeFilter }];
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const meals = await Meal.find(query)
      .populate("user", "name email")
      .populate("foods")
      .sort({ createdAt: -1 });

    res.json(meals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get meal by ID
// @route   GET /api/meals/:id
// @access  Private
const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate("user", "name email")
      .populate("foods");

    if (meal) {
      if (meal.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to view this meal");
      }
      res.json(meal);
    } else {
      res.status(404);
      throw new Error("Meal not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new meal
// @route   POST /api/meals
// @access  Private
const createMeal = async (req, res, next) => {
  try {
    const { name, mealType, category, foods, totalCalories, totalProtein, totalCarbs, totalFat, scheduledTime, date } = req.body;
    const type = mealType || category || "Breakfast";

    let calculatedCalories = totalCalories || 0;
    let calculatedProtein = totalProtein || 0;
    let calculatedCarbs = totalCarbs || 0;
    let calculatedFat = totalFat || 0;

    if (foods && Array.isArray(foods) && foods.length > 0) {
      const foodItems = await Food.find({ _id: { $in: foods } });
      if (foodItems.length > 0 && (!totalCalories && !totalProtein && !totalCarbs && !totalFat)) {
        calculatedCalories = foodItems.reduce((acc, f) => acc + (f.calories || 0), 0);
        calculatedProtein = foodItems.reduce((acc, f) => acc + (f.protein || 0), 0);
        calculatedCarbs = foodItems.reduce((acc, f) => acc + (f.carbs || 0), 0);
        calculatedFat = foodItems.reduce((acc, f) => acc + (f.fat || 0), 0);
      }
    }

    const meal = new Meal({
      user: req.user._id,
      name: name || `${type} Meal`,
      mealType: type,
      category: type,
      foods: foods || [],
      totalCalories: calculatedCalories,
      totalProtein: calculatedProtein,
      totalCarbs: calculatedCarbs,
      totalFat: calculatedFat,
      scheduledTime: scheduledTime || "08:00 AM",
      date: date || Date.now(),
    });

    const createdMeal = await meal.save();
    const populatedMeal = await Meal.findById(createdMeal._id).populate("foods").populate("user", "name email");

    res.status(201).json(populatedMeal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
const updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (meal) {
      if (meal.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to edit this meal");
      }

      meal.name = req.body.name || meal.name;
      meal.mealType = req.body.mealType || req.body.category || meal.mealType;
      meal.category = meal.mealType;
      if (req.body.foods) meal.foods = req.body.foods;

      if (req.body.totalCalories !== undefined) meal.totalCalories = req.body.totalCalories;
      if (req.body.totalProtein !== undefined) meal.totalProtein = req.body.totalProtein;
      if (req.body.totalCarbs !== undefined) meal.totalCarbs = req.body.totalCarbs;
      if (req.body.totalFat !== undefined) meal.totalFat = req.body.totalFat;

      meal.scheduledTime = req.body.scheduledTime || meal.scheduledTime;
      meal.date = req.body.date || meal.date;

      const updatedMeal = await meal.save();
      const populatedMeal = await Meal.findById(updatedMeal._id).populate("foods").populate("user", "name email");

      res.json(populatedMeal);
    } else {
      res.status(404);
      throw new Error("Meal not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (meal) {
      if (meal.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this meal");
      }

      await meal.deleteOne();
      res.json({ message: "Meal deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Meal not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
