const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    console.log("🔄 Initializing Admin Seeder...");
    await connectDB();

    const adminName = process.env.ADMIN_NAME || "Admin User";
    const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@nutriapp.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    if (!adminPassword) {
      console.error("❌ Admin password is required in configuration.");
      process.exit(1);
    }

    // Search by email, username, or legacy "admin" username
    let admin = await User.findOne({
      $or: [{ email: adminEmail }, { username: adminUsername }, { username: "admin" }],
    });

    if (admin) {
      admin.name = adminName;
      admin.username = adminUsername;
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.role = "Admin";

      await admin.save();
      console.log(`✅ Admin account updated successfully: ${admin.email} (Username: ${admin.username})`);
    } else {
      admin = await User.create({
        name: adminName,
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: "Admin",
      });
      console.log(`✅ Admin account created successfully: ${admin.email} (Username: ${admin.username})`);
    }

    // Clean up any remaining legacy admin users if username changed from "admin"
    if (adminUsername !== "admin") {
      const deletedLegacy = await User.deleteMany({ username: "admin", _id: { $ne: admin._id } });
      if (deletedLegacy.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedLegacy.deletedCount} legacy admin account(s).`);
      }
    }

    console.log("🚀 Seeder completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running Admin Seeder:", error.message);
    process.exit(1);
  }
};

seedAdmin();
