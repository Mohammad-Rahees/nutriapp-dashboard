const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Daily log must belong to a user"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Log date is required"],
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],
    totalCalories: {
      type: Number,
      default: 0,
      min: [0, "Total calories cannot be negative"],
    },
    totalProtein: {
      type: Number,
      default: 0,
      min: [0, "Total protein cannot be negative"],
    },
    totalCarbs: {
      type: Number,
      default: 0,
      min: [0, "Total carbs cannot be negative"],
    },
    totalFat: {
      type: Number,
      default: 0,
      min: [0, "Total fat cannot be negative"],
    },
    waterIntake: {
      type: Number, // in ml or glasses
      default: 0,
      min: [0, "Water intake cannot be negative"],
    },
    weightLog: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const DailyLog = mongoose.model("DailyLog", dailyLogSchema);
module.exports = DailyLog;
