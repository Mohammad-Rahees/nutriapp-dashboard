const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role, age, gender, height, weight, goal, activityLevel } = req.body;

    const displayName = name || username;

    if (!displayName || !email || !password) {
      res.status(400);
      throw new Error("Please provide name/username, email, and password");
    }

    const userExists = await User.findOne({ $or: [{ email }, { name: displayName }] });

    if (userExists) {
      res.status(400);
      throw new Error("User with this email or name already exists");
    }

    const user = await User.create({
      name: displayName,
      username: username || displayName.toLowerCase().replace(/\s+/g, "_"),
      email,
      password,
      role: role || "user",
      age: age || 25,
      gender: gender || "Prefer not to say",
      height: height || 170,
      weight: weight || 70,
      goal: goal || "Maintain Weight",
      activityLevel: activityLevel || "Moderately Active",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activityLevel: user.activityLevel,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyProteinGoal: user.dailyProteinGoal,
        dailyCarbGoal: user.dailyCarbGoal,
        dailyFatGoal: user.dailyFatGoal,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const identifier = email || username || name;

    if (!identifier || !password) {
      res.status(400);
      throw new Error("Please provide email/username/name, and password");
    }

    // Find user by email, username, or name
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { name: identifier }],
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activityLevel: user.activityLevel,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyProteinGoal: user.dailyProteinGoal,
        dailyCarbGoal: user.dailyCarbGoal,
        dailyFatGoal: user.dailyFatGoal,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
