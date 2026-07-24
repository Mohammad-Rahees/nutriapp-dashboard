const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Meal must belong to a user"],
    },
    name: {
      type: String,
      trim: true,
    },
    mealType: {
      type: String,
      required: [true, "Meal type is required"],
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      default: "Breakfast",
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
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
    scheduledTime: {
      type: String,
      default: "08:00 AM",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure category and mealType stay synced, and set name default
mealSchema.pre("save", function (next) {
  if (this.mealType && !this.category) {
    this.category = this.mealType;
  } else if (this.category && !this.mealType) {
    this.mealType = this.category;
  }
  if (!this.name) {
    this.name = `${this.mealType || "Meal"} - ${new Date(this.date).toLocaleDateString()}`;
  }
  next();
});

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
