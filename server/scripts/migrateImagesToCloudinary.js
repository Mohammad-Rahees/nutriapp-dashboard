const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Food = require("../models/Food");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

const migrate = async () => {
  console.log("🚀 Starting NutriApp One-Time Cloudinary Image Migration...\n");

  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nutridb";

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB for Migration.\n");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  let totalScanned = 0;
  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // 1. Migrate Food / Meal Images
  console.log("--------------------------------------------------");
  console.log("📦 1. Scanning Foods / Meals Collection...");
  console.log("--------------------------------------------------");
  try {
    const foods = await Food.find({});
    console.log(`Found ${foods.length} food documents in database.\n`);

    for (const food of foods) {
      totalScanned++;
      const currentImage = food.image;

      if (!currentImage || typeof currentImage !== "string" || currentImage.trim() === "") {
        console.log(`[SKIP] Food "${food.title || food.name}" (#${food._id}) - No image string present.`);
        totalSkipped++;
        continue;
      }

      if (currentImage.includes("res.cloudinary.com")) {
        console.log(`[SKIP] Food "${food.title || food.name}" (#${food._id}) - Already hosted on Cloudinary.`);
        totalSkipped++;
        continue;
      }

      console.log(`[UPLOADING] Food "${food.title || food.name}" (#${food._id})...`);
      try {
        const cloudinaryUrl = await uploadToCloudinary(currentImage, "nutriapp/meals");
        if (cloudinaryUrl && cloudinaryUrl !== currentImage) {
          food.image = cloudinaryUrl;
          await food.save();
          console.log(`  └─ SUCCESS: Updated image URL to ${cloudinaryUrl}`);
          totalMigrated++;
        } else {
          console.log(`  └─ UNCHANGED: Kept original URL ${currentImage}`);
          totalSkipped++;
        }
      } catch (err) {
        console.error(`  └─ ERROR migrating food image (#${food._id}):`, err.message);
        totalErrors++;
      }
    }
  } catch (err) {
    console.error("❌ Error querying Foods collection:", err.message);
    totalErrors++;
  }

  // 2. Migrate User Avatar / Profile Pictures
  console.log("\n--------------------------------------------------");
  console.log("👤 2. Scanning Users Collection...");
  console.log("--------------------------------------------------");
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} user documents in database.\n`);

    for (const userDoc of users) {
      totalScanned++;
      const currentAvatar = userDoc.avatar;

      if (!currentAvatar || typeof currentAvatar !== "string" || currentAvatar.trim() === "") {
        console.log(`[SKIP] User "${userDoc.name || userDoc.username}" (#${userDoc._id}) - No avatar string present.`);
        totalSkipped++;
        continue;
      }

      if (currentAvatar.includes("res.cloudinary.com")) {
        console.log(`[SKIP] User "${userDoc.name || userDoc.username}" (#${userDoc._id}) - Already hosted on Cloudinary.`);
        totalSkipped++;
        continue;
      }

      console.log(`[UPLOADING] User "${userDoc.name || userDoc.username}" (#${userDoc._id})...`);
      try {
        const cloudinaryUrl = await uploadToCloudinary(currentAvatar, "nutriapp/users");
        if (cloudinaryUrl && cloudinaryUrl !== currentAvatar) {
          userDoc.avatar = cloudinaryUrl;
          await userDoc.save();
          console.log(`  └─ SUCCESS: Updated avatar URL to ${cloudinaryUrl}`);
          totalMigrated++;
        } else {
          console.log(`  └─ UNCHANGED: Kept original URL ${currentAvatar}`);
          totalSkipped++;
        }
      } catch (err) {
        console.error(`  └─ ERROR migrating user avatar (#${userDoc._id}):`, err.message);
        totalErrors++;
      }
    }
  } catch (err) {
    console.error("❌ Error querying Users collection:", err.message);
    totalErrors++;
  }

  // Migration Summary Report
  console.log("\n==================================================");
  console.log("🎉 MIGRATION SUMMARY REPORT");
  console.log("==================================================");
  console.log(`Total Documents Scanned : ${totalScanned}`);
  console.log(`Successfully Migrated   : ${totalMigrated}`);
  console.log(`Skipped (Already Cloudinary/Empty) : ${totalSkipped}`);
  console.log(`Errors Encountered     : ${totalErrors}`);
  console.log("==================================================\n");

  await mongoose.disconnect();
  console.log("✅ MongoDB disconnected. Migration complete.");
  process.exit(0);
};

migrate();
