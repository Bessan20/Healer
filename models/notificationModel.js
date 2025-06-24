// models/Notification.js

// Import Mongoose to create the schema
const mongoose = require("mongoose");

const allNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: false,
    },
    message: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

// Export the Notification model
module.exports = mongoose.model("AllNotification", allNotificationSchema);
