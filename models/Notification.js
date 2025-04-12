// models/Notification.js

// Import Mongoose to create the schema
const mongoose = require('mongoose');

// Define the Notification schema
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model (patient)
        ref: 'User', // Link to the User model
        required: false, // Not required because some notifications might be for doctors only
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Doctor model
        ref: 'Doctor', // Link to the Doctor model
        required: false, // Not required because some notifications might be for users only
    },
    message: {
        type: String, // The message content of the notification
        required: true, // Ensure message is always provided
    },
    read: {
        type: Boolean, // Track if the notification has been read
        default: false, // Default to unread (false)
    },
    createdAt: {
        type: Date, // Timestamp of when the notification was created
        default: Date.now, // Automatically set to the current date/time
    },
});

// Export the Notification model
module.exports = mongoose.model('Notification', notificationSchema);