// routes/appointmentRouter.js

// Import Express Router
const express = require('express');
const router = express.Router();

// Import the controllers and validators
const {
    getAllAppointments,
    createAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController.js');

// Import the Notification model for fetching and updating notifications
const Notification = require('../models/Notification');

const { createAppointmentValidator, cancelAppointmentValidator } = require('../utils/validators/appointmentValidator.js');
const { protect } = require('../controllers/authController.js');
const apiError = require('../utils/apiError'); // لازم تتأكد إن الملف دا موجود

// Helper function to format the date
const formatNotificationDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);

    const isToday =
        now.getDate() === notificationDate.getDate() &&
        now.getMonth() === notificationDate.getMonth() &&
        now.getFullYear() === notificationDate.getFullYear();

    if (isToday) {
        const hoursDiff = Math.floor((now - notificationDate) / (1000 * 60 * 60));
        if (hoursDiff < 1) {
            const minutesDiff = Math.floor((now - notificationDate) / (1000 * 60));
            return minutesDiff < 1 ? 'Just now' : `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} ago`;
        }
        return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    }

    const day = notificationDate.getDate();
    const month = notificationDate.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
};

// Route to get all appointments
router.route('/getAllAppointments').get(getAllAppointments);

// Route to create a new appointment
router.route('/createAppointment').post(protect, createAppointmentValidator, createAppointment);

// Route to cancel an appointment
router.route('/cancelAppointment').delete(protect, cancelAppointmentValidator, cancelAppointment);

// Route to fetch notifications for a user or doctor
router.get('/notifications/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const notifications = await Notification.find({
            $or: [{ userId: id }, { doctorId: id }],
        }).sort({ createdAt: -1 });

        const formattedNotifications = notifications.map((notification) => ({
            _id: notification._id,
            userId: notification.userId,
            doctorId: notification.doctorId,
            message: notification.message,
            read: notification.read,
            createdAt: notification.createdAt,
            formattedDate: formatNotificationDate(notification.createdAt),
        }));

        res.status(200).json(formattedNotifications);
    } catch (error) {
        next(error);
    }
});

// Route to mark a notification as read
router.patch('/notifications/:id/markAsRead', protect, async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id.toString();

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return next(new apiError('Notification not found', 404));
        }

        if (
            notification.userId?.toString() !== userId &&
            notification.doctorId?.toString() !== userId
        ) {
            return next(new apiError('You are not authorized to update this notification', 403));
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            data: notification,
        });
    } catch (error) {
        next(error);
    }
});

// Route to mark all notifications as read
router.patch('/notifications/:id/markAllAsRead', protect, async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user._id.toString();

        // Check if the ID matches the logged-in user
        if (id !== userId) {
            return next(new apiError('You are not authorized to update these notifications', 403));
        }

        // Update all notifications for the user or doctor to be read
        await Notification.updateMany(
            { $or: [{ userId: id }, { doctorId: id }], read: false },
            { $set: { read: true } }
        );

        res.status(200).json({
            status: 'success',
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
});

// Route to delete all notifications
router.delete('/notifications/:id/deleteAll', protect, async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user._id.toString();

        // Check if the ID matches the logged-in user
        if (id !== userId) {
            return next(new apiError('You are not authorized to delete these notifications', 403));
        }

        // Delete all notifications for the user or doctor
        await Notification.deleteMany({
            $or: [{ userId: id }, { doctorId: id }],
        });

        res.status(200).json({
            status: 'success',
            message: 'All notifications deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Export the router
module.exports = router;
