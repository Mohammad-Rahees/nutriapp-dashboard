const DailyLog = require("../models/DailyLog");
const Meal = require("../models/Meal");

// @desc    Get daily log for specified date
// @route   GET /api/logs/daily
// @access  Private
const getDailyLog = async (req, res, next) => {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    let log = await DailyLog.findOne({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: "meals",
        populate: { path: "foods" },
      })
      .populate("user", "name email");

    if (!log) {
      log = await DailyLog.create({
        user: req.user._id,
        date: startDate,
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        waterIntake: 0,
      });

      log = await DailyLog.findById(log._id).populate("user", "name email");
    }

    res.json(log);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update daily log
// @route   POST /api/logs/daily
// @access  Private
const createOrUpdateDailyLog = async (req, res, next) => {
  try {
    const targetDate = req.body.date ? new Date(req.body.date) : new Date();
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const { waterIntake, weightLog, notes, mealIds, totalCalories, totalProtein, totalCarbs, totalFat } = req.body;

    let log = await DailyLog.findOne({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!log) {
      log = new DailyLog({
        user: req.user._id,
        date: startDate,
      });
    }

    if (waterIntake !== undefined) log.waterIntake = waterIntake;
    if (weightLog !== undefined) log.weightLog = weightLog;
    if (notes !== undefined) log.notes = notes;

    if (mealIds && Array.isArray(mealIds)) {
      log.meals = mealIds;
    }

    // Calculate totals from associated meals or override values
    if (log.meals && log.meals.length > 0) {
      const populatedMeals = await Meal.find({ _id: { $in: log.meals } });
      log.totalCalories = totalCalories !== undefined ? totalCalories : populatedMeals.reduce((acc, m) => acc + (m.totalCalories || 0), 0);
      log.totalProtein = totalProtein !== undefined ? totalProtein : populatedMeals.reduce((acc, m) => acc + (m.totalProtein || 0), 0);
      log.totalCarbs = totalCarbs !== undefined ? totalCarbs : populatedMeals.reduce((acc, m) => acc + (m.totalCarbs || 0), 0);
      log.totalFat = totalFat !== undefined ? totalFat : populatedMeals.reduce((acc, m) => acc + (m.totalFat || 0), 0);
    } else {
      if (totalCalories !== undefined) log.totalCalories = totalCalories;
      if (totalProtein !== undefined) log.totalProtein = totalProtein;
      if (totalCarbs !== undefined) log.totalCarbs = totalCarbs;
      if (totalFat !== undefined) log.totalFat = totalFat;
    }

    const savedLog = await log.save();
    const populatedLog = await DailyLog.findById(savedLog._id)
      .populate({ path: "meals", populate: { path: "foods" } })
      .populate("user", "name email");

    res.status(200).json(populatedLog);
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary / weekly history of logs
// @route   GET /api/logs/summary
// @access  Private
const getLogSummary = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.days) || 7;
    const logs = await DailyLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit)
      .populate({ path: "meals", populate: { path: "foods" } })
      .populate("user", "name email");

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a daily log
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = async (req, res, next) => {
  try {
    const log = await DailyLog.findById(req.params.id);

    if (log) {
      if (log.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this log");
      }

      await log.deleteOne();
      res.json({ message: "Daily log deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Daily log not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyLog,
  createOrUpdateDailyLog,
  getLogSummary,
  deleteLog,
};
