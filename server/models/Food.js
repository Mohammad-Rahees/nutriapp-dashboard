const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Other",
    },
    calories: {
      type: Number,
      required: [true, "Calories value is required"],
      min: [0, "Calories must be a positive number"],
    },
    protein: {
      type: Number,
      default: 0,
      min: [0, "Protein cannot be negative"],
    },
    carbs: {
      type: Number,
      default: 0,
      min: [0, "Carbs cannot be negative"],
    },
    fat: {
      type: Number,
      default: 0,
      min: [0, "Fat cannot be negative"],
    },
    servingSize: {
      type: String,
      default: "1 serving",
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    time: {
      type: String,
      default: "15 min",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    price: {
      type: Number,
      default: 9.99,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure name and title match
foodSchema.pre("save", function () {
  if (this.name && !this.title) {
    this.title = this.name;
  } else if (this.title && !this.name) {
    this.name = this.title;
  }
  if (!this.createdBy && this.user) {
    this.createdBy = this.user;
  } else if (!this.user && this.createdBy) {
    this.user = this.createdBy;
  }
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
