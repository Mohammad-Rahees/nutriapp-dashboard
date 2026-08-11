const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

/**
 * Upload an image (local file path, base64 data URL, or remote URL) to Cloudinary.
 * If already hosted on Cloudinary, skips re-uploading and returns original URL.
 *
 * @param {string} imageInput - Local path, Base64 string, or image URL
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - Cloudinary HTTPS URL
 */
const uploadToCloudinary = async (imageInput, folder = "nutriapp/meals") => {
  try {
    if (!imageInput || typeof imageInput !== "string") {
      return imageInput || "";
    }

    const trimmedInput = imageInput.trim();

    // 1. Skip if already hosted on Cloudinary
    if (trimmedInput.includes("res.cloudinary.com")) {
      return trimmedInput;
    }

    // 2. If it's a local relative file path (e.g. "uploads/food.jpg"), resolve absolute path
    let sourceToUpload = trimmedInput;
    if (!trimmedInput.startsWith("http://") && !trimmedInput.startsWith("https://") && !trimmedInput.startsWith("data:image")) {
      const possiblePath = path.isAbsolute(trimmedInput)
        ? trimmedInput
        : path.join(__dirname, "..", trimmedInput);

      if (fs.existsSync(possiblePath)) {
        sourceToUpload = possiblePath;
      }
    }

    // 3. Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(sourceToUpload, {
      folder: folder,
      resource_type: "auto",
    });

    if (uploadResult && uploadResult.secure_url) {
      return uploadResult.secure_url;
    }

    if (trimmedInput.startsWith("data:image")) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop";
    }

    return trimmedInput;
  } catch (error) {
    console.error("⚠️ Cloudinary upload warning:", error.message || error);
    // If base64 data string failed to upload to Cloudinary, return fallback URL so MongoDB write never fails
    if (imageInput && typeof imageInput === "string" && imageInput.startsWith("data:image")) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop";
    }
    return imageInput;
  }
};

module.exports = {
  uploadToCloudinary,
};
