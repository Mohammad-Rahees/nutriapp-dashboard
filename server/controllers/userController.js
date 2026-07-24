const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.age = req.body.age !== undefined ? req.body.age : user.age;
      user.gender = req.body.gender || user.gender;
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      user.goal = req.body.goal || user.goal;
      user.activityLevel = req.body.activityLevel || user.activityLevel;
      user.dailyCalorieGoal = req.body.dailyCalorieGoal !== undefined ? req.body.dailyCalorieGoal : user.dailyCalorieGoal;
      user.dailyProteinGoal = req.body.dailyProteinGoal !== undefined ? req.body.dailyProteinGoal : user.dailyProteinGoal;
      user.dailyCarbGoal = req.body.dailyCarbGoal !== undefined ? req.body.dailyCarbGoal : user.dailyCarbGoal;
      user.dailyFatGoal = req.body.dailyFatGoal !== undefined ? req.body.dailyFatGoal : user.dailyFatGoal;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        age: updatedUser.age,
        gender: updatedUser.gender,
        height: updatedUser.height,
        weight: updatedUser.weight,
        goal: updatedUser.goal,
        activityLevel: updatedUser.activityLevel,
        dailyCalorieGoal: updatedUser.dailyCalorieGoal,
        dailyProteinGoal: updatedUser.dailyProteinGoal,
        dailyCarbGoal: updatedUser.dailyCarbGoal,
        dailyFatGoal: updatedUser.dailyFatGoal,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
