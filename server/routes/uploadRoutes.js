const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Public/Private
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    // 1. Handle Multipart File upload via Multer + Cloudinary
    if (req.file && (req.file.path || req.file.secure_url)) {
      const imageUrl = req.file.path || req.file.secure_url;
      return res.json({
        success: true,
        url: imageUrl,
      });
    }

    // 2. Handle JSON Base64 string or remote URL upload in req.body
    if (req.body && req.body.image) {
      const folder = req.body.folder || "nutriapp/uploads";
      const uploadedUrl = await uploadToCloudinary(req.body.image, folder);
      return res.json({
        success: true,
        url: uploadedUrl,
      });
    }

    res.status(400);
    throw new Error("No image file or base64 image data provided");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
