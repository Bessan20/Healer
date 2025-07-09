const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({ storage });

// Middleware to handle file uploads
exports.uploadFile = upload.single("image"); // Expecting a single file with the field name "image"

exports.createNotification = asyncHandler(async (req, res, next) => {
  const { title, message } = req.body;
  const userId = req.user._id;

  if (!title || !message) {
    return res.status(400).json({
      message: "Title and message are required.",
    });
  }

  // ✅ رفع صورة لو فيه
  let imageUrl;

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "notification" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrl = result.secure_url;
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
    image: imageUrl,
  });

  res.status(201).json({
    status: "success",
    data: notification,
  });
});

exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: notifications,
  });
});
