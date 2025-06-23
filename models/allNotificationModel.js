// models/Notification.js

// Import Mongoose to create the schema
const mongoose = require("mongoose");

// Define the Notification schema
const allNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  medicine: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
  ],
});

// Export the Notification model
module.exports = mongoose.model("allNotification", allNotificationSchema);
