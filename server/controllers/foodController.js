const Food = require("../models/Food");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

const initialFoodItems = [
  { name: 'Grilled Salmon & Quinoa', category: 'Dinner', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&q=80&auto=format&fit=crop', calories: 450, protein: 38, carbs: 42, fat: 14, servingSize: '1 bowl', time: '25 min', difficulty: 'Medium', price: 14.99 },
  { name: 'Avocado Toast with Egg', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80&auto=format&fit=crop', calories: 320, protein: 14, carbs: 30, fat: 16, servingSize: '2 slices', time: '15 min', difficulty: 'Easy', price: 9.99 },
  { name: 'Berry Smoothie Bowl', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80&auto=format&fit=crop', calories: 280, protein: 8, carbs: 54, fat: 4, servingSize: '1 bowl', time: '10 min', difficulty: 'Easy', price: 8.49 },
  { name: 'Spicy Tofu Stir Fry', category: 'Vegan', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop', calories: 380, protein: 22, carbs: 36, fat: 12, servingSize: '1 plate', time: '30 min', difficulty: 'Hard', price: 11.99 },
  { name: 'Chicken Caesar Salad', category: 'Lunch', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop', calories: 410, protein: 35, carbs: 12, fat: 22, servingSize: '1 bowl', time: '15 min', difficulty: 'Easy', price: 12.50 },
  { name: 'Beef & Broccoli Bowl', category: 'Dinner', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop', calories: 520, protein: 42, carbs: 48, fat: 18, servingSize: '1 bowl', time: '20 min', difficulty: 'Medium', price: 15.99 },
  { name: 'Vegan Buddha Bowl', category: 'Vegan', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop', calories: 400, protein: 16, carbs: 58, fat: 14, servingSize: '1 bowl', time: '25 min', difficulty: 'Medium', price: 11.49 },
  { name: 'Greek Yogurt Parfait', category: 'Snack', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop', calories: 210, protein: 18, carbs: 26, fat: 3, servingSize: '1 cup', time: '5 min', difficulty: 'Easy', price: 6.99 },
  { name: 'Turkey Wrap', category: 'Lunch', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80&auto=format&fit=crop', calories: 350, protein: 28, carbs: 32, fat: 10, servingSize: '1 wrap', time: '10 min', difficulty: 'Easy', price: 10.25 },
  { name: 'Protein Pancakes', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1528207776546-38d94b0f443e?w=800&q=80&auto=format&fit=crop', calories: 450, protein: 32, carbs: 55, fat: 8, servingSize: '3 pancakes', time: '20 min', difficulty: 'Medium', price: 10.99 },
];

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    let foods = await Food.find(query).populate("createdBy", "name email");

    // If database is empty, auto-seed initial food items so default data is present in DB
    if (foods.length === 0 && !search && (!category || category === "All")) {
      const count = await Food.countDocuments();
      if (count === 0) {
        await Food.insertMany(initialFoodItems);
        foods = await Food.find(query).populate("createdBy", "name email");
      }
    }

    const formattedFoods = foods.map((f) => {
      const obj = f.toObject ? f.toObject() : f;
      return {
        ...obj,
        id: obj._id ? obj._id.toString() : obj.id,
      };
    });

    res.json(formattedFoods);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate("createdBy", "name email");

    if (food) {
      const obj = food.toObject();
      res.json({ ...obj, id: obj._id.toString() });
    } else {
      res.status(404);
      throw new Error("Food item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food item
// @route   POST /api/foods
// @access  Private/Public
const createFood = async (req, res, next) => {
  try {
    const { name, title, description, category, image, calories, protein, carbs, fat, servingSize, time, difficulty, price } = req.body;

    const foodName = name || title;

    if (!foodName || calories === undefined) {
      res.status(400);
      throw new Error("Food name and calories are required");
    }

    // Automatically convert image to Cloudinary URL if base64 or file path
    const imageUrl = image ? await uploadToCloudinary(image, "nutriapp/meals") : "";

    const food = new Food({
      name: foodName,
      title: foodName,
      description: description || "",
      category: category || "Other",
      image: imageUrl,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      servingSize: servingSize || "1 serving",
      time: time || "15 min",
      difficulty: difficulty || "Easy",
      price: Number(price) || 9.99,
      createdBy: req.user ? req.user._id : null,
      user: req.user ? req.user._id : null,
    });

    const createdFood = await food.save();
    const obj = createdFood.toObject();
    res.status(201).json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = req.body.name || req.body.title || food.name;
      food.title = food.name;
      food.category = req.body.category || food.category;
      
      if (req.body.image) {
        food.image = await uploadToCloudinary(req.body.image, "nutriapp/meals");
      }

      food.calories = req.body.calories !== undefined ? req.body.calories : food.calories;
      food.protein = req.body.protein !== undefined ? req.body.protein : food.protein;
      food.carbs = req.body.carbs !== undefined ? req.body.carbs : food.carbs;
      food.fat = req.body.fat !== undefined ? req.body.fat : food.fat;
      food.servingSize = req.body.servingSize || food.servingSize;
      food.time = req.body.time || food.time;
      food.difficulty = req.body.difficulty || food.difficulty;
      food.price = req.body.price !== undefined ? req.body.price : food.price;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404);
      throw new Error("Food item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await food.deleteOne();
      res.json({ message: "Food item removed successfully" });
    } else {
      res.status(404);
      throw new Error("Food item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Seed initial food dataset
// @route   POST /api/foods/seed
// @access  Public/Private
const seedFoods = async (req, res, next) => {
  try {
    await Food.deleteMany({});
    const createdFoods = await Food.insertMany(initialFoodItems);
    res.status(201).json({ message: "Foods seeded successfully", count: createdFoods.length, foods: createdFoods });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  seedFoods,
};
