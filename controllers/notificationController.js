const Notification = require("../models/notificationModel");
const asyncHandler = require("express-async-handler");

exports.createNotification = asyncHandler(async (req, res, next) => {
  const { title, message } = req.body;
  const userId = req.user._id;

  if (!title || !message) {
    return res.status(400).json({
      message: "Title and message are required.",
    });
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
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
