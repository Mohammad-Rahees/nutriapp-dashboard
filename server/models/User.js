const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
    },
    role: {
      type: String,
      enum: ["Customer", "Admin", "Delivery", "user", "admin", "delivery"],
      default: "Customer",
    },
    age: {
      type: Number,
      min: [0, "Age must be a positive number"],
      default: 25,
    },
    gender: {
      type: String,
      enum: ["Female", "Male", "Non-binary", "Prefer not to say"],
      default: "Prefer not to say",
    },
    height: {
      type: Number, // in cm
      min: [0, "Height must be a positive number"],
      default: 170,
    },
    weight: {
      type: Number, // in kg
      min: [0, "Weight must be a positive number"],
      default: 70,
    },
    goal: {
      type: String,
      enum: ["Lose Weight", "Maintain Weight", "Gain Muscle", "Improve General Fitness"],
      default: "Maintain Weight",
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Super Active"],
      default: "Moderately Active",
    },
    dailyCalorieGoal: {
      type: Number,
      default: 2000,
    },
    dailyProteinGoal: {
      type: Number,
      default: 150,
    },
    dailyCarbGoal: {
      type: Number,
      default: 250,
    },
    dailyFatGoal: {
      type: Number,
      default: 65,
    },
    phone: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    vehicleType: {
      type: String,
      enum: ["Bike", "Scooter", "Car", "Bicycle", "None"],
      default: "None",
    },
    vehicleNumber: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password and set username default if empty
userSchema.pre("save", async function () {
  if (!this.username && this.name) {
    this.username = this.name.toLowerCase().replace(/\s+/g, "_");
  }
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
