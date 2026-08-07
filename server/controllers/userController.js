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

// @desc    Get all users (optional filter by role)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = { $regex: `^${req.query.role}$`, $options: "i" };
    }
    const users = await User.find(filter).select("-password");
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

// @desc    Create new Delivery Personnel user (Admin endpoint)
// @route   POST /api/users/delivery
// @access  Private/Admin
const createDeliveryUser = async (req, res, next) => {
  try {
    const { 
      name, username, email, password, phone, gender, 
      vehicleType, vehicleNumber, emergencyContact 
    } = req.body;

    const chosenUsername = (username || name || "delivery_user").trim().toLowerCase().replace(/\s+/g, "_");
    const userEmail = (email || `${chosenUsername}@nutriapp.com`).trim().toLowerCase();

    if (!password) {
      res.status(400);
      throw new Error("Password is required for new delivery personnel account");
    }

    const userExists = await User.findOne({ $or: [{ email: userEmail }, { username: chosenUsername }] });
    if (userExists) {
      res.status(400);
      throw new Error("User with this email or username already exists");
    }

    const user = await User.create({
      name: name || chosenUsername,
      username: chosenUsername,
      email: userEmail,
      password: password.trim(),
      role: "Delivery",
      phone: phone || "",
      gender: gender || "Prefer not to say",
      vehicleType: vehicleType || "Bike",
      vehicleNumber: vehicleNumber || "",
      emergencyContact: emergencyContact || "",
      isActive: true,
      profileCompleted: true,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details by Admin (e.g. edit delivery details, toggle status)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.username = req.body.username !== undefined ? req.body.username : user.username;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
    user.vehicleType = req.body.vehicleType !== undefined ? req.body.vehicleType : user.vehicleType;
    user.vehicleNumber = req.body.vehicleNumber !== undefined ? req.body.vehicleNumber : user.vehicleNumber;
    user.emergencyContact = req.body.emergencyContact !== undefined ? req.body.emergencyContact : user.emergencyContact;
    user.isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : user.isActive;

    if (req.body.password && req.body.password.trim().length > 0) {
      user.password = req.body.password.trim();
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  createDeliveryUser,
  updateUserById,
};
