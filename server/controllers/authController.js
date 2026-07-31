const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Helper to ensure default Admin exists in MongoDB
const seedAdminIfNeeded = async () => {
  try {
    let admin = await User.findOne({ username: "admin" });
    let needsRecreation = false;

    if (admin) {
      const isMatch = await admin.matchPassword("admin");
      if (!isMatch || admin.role !== "Admin") {
        await User.deleteOne({ _id: admin._id });
        needsRecreation = true;
      }
    }

    if (!admin || needsRecreation) {
      admin = await User.create({
        name: "Admin User",
        username: "admin",
        email: "admin@nutriapp.com",
        password: "admin",
        role: "Admin",
      });
      console.log("✅ Seeded permanent Admin user (admin/admin) into MongoDB");
    }
    return admin;
  } catch (err) {
    console.error("Error seeding Admin user:", err);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role, age, gender, height, weight, goal, activityLevel } = req.body;

    const chosenUsername = (username || name || "user").trim().toLowerCase().replace(/\s+/g, "_");
    const displayName = name || username || chosenUsername;
    const userEmail = (email || `${chosenUsername}@nutriapp.com`).trim().toLowerCase();

    if (!password) {
      res.status(400);
      throw new Error("Please provide a password");
    }

    const userExists = await User.findOne({ $or: [{ email: userEmail }, { username: chosenUsername }] });

    if (userExists) {
      res.status(400);
      throw new Error("User with this email or username already exists");
    }

    const user = await User.create({
      name: displayName,
      username: chosenUsername,
      email: userEmail,
      password,
      role: role || "Customer",
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
    const identifier = (username || email || name || "").trim().toLowerCase();

    if (!identifier || !password) {
      res.status(400);
      throw new Error("Please provide username/email and password");
    }

    // Auto-seed admin user if login attempt is admin/admin
    if (identifier === "admin" && password === "admin") {
      await seedAdminIfNeeded();
    }

    // Find user by email, username, or name
    let user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { name: identifier },
        { username: { $regex: `^${identifier}$`, $options: "i" } }
      ],
    });

    if (user && (await user.matchPassword(password))) {
      const userObj = user.toObject();
      delete userObj.password;

      res.json({
        ...userObj,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid username or password");
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

// @desc    Update user profile details & avatar
// @route   PUT /api/auth/profile
// @access  Public/Private
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : (req.body.userId || req.body._id);
    if (!userId) {
      res.status(400);
      throw new Error("User ID is required to update profile");
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User document not found");
    }

    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.username = req.body.username !== undefined ? req.body.username : user.username;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
    user.dob = req.body.dob !== undefined ? req.body.dob : user.dob;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.city = req.body.city !== undefined ? req.body.city : user.city;
    user.state = req.body.state !== undefined ? req.body.state : user.state;
    user.country = req.body.country !== undefined ? req.body.country : user.country;
    user.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : user.postalCode;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.age = req.body.age !== undefined ? Number(req.body.age) : user.age;
    user.height = req.body.height !== undefined ? Number(req.body.height) : user.height;
    user.weight = req.body.weight !== undefined ? Number(req.body.weight) : user.weight;
    user.goal = req.body.goal !== undefined ? req.body.goal : user.goal;
    user.activityLevel = req.body.activityLevel !== undefined ? req.body.activityLevel : user.activityLevel;

    const updatedUser = await user.save();
    console.log("✅ User profile updated in MongoDB:", updatedUser._id);

    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({
      ...userObj,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  seedAdminIfNeeded,
};
