const express = require("express");
const router = express.Router();
const {
  createNotification,
  getMyNotifications,
} = require("../controllers/notificationController.js");

const { protect } = require("../controllers/authController.js");

router
  .route("/")
  .post(protect, createNotification)
  .get(protect, getMyNotifications);

module.exports = router;
