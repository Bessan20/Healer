// controllers/appointmentController.js

// Import required modules
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory.js');
const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const Doctor = require('../models/doctorModel.js');
const Notification = require('../models/Notification');
const apiError = require('../utils/apiError.js');

// Get all appointments using factory handler
const getAllAppointments = factory.getAll(Appointment);

// Create a new appointment
const createAppointment = asyncHandler(async (req, res, next) => {
    const { doctorId, date } = req.body;

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate)) {
        return next(new apiError('Invalid date format. Please use a valid date (e.g., "2025-04-15").', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new apiError('User not found', 404));
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return next(new apiError('Doctor not found', 404));
    }

    const appointment = await Appointment.create({
        patientName: user.name,
        patientMobile: user.mobilePhone,
        patientId: user._id,
        doctorName: doctor.name,
        doctorId,
        date: appointmentDate,
        queueNumber: 1,
    });

    const appointmentDetails = {
        patientID: appointment.patientId,
        Date: appointment.date,
        queueNum: appointment.queueNumber,
    };

    await Doctor.findByIdAndUpdate(
        doctorId,
        { $push: { doctorSchedule: appointmentDetails } },
        { new: true }
    );

    const patientNotification = new Notification({
        userId: user._id,
        message: `Hello ${user.name}, your appointment with Dr. ${doctor.name} on ${appointmentDate.toISOString().split('T')[0]} has been booked! Queue: ${appointment.queueNumber}`,
    });
    await patientNotification.save();

    const doctorNotification = new Notification({
        doctorId: doctorId,
        message: `Dr. ${doctor.name}, you have a new appointment with ${user.name} on ${appointmentDate.toISOString().split('T')[0]}. Queue: ${appointment.queueNumber}`,
    });
    await doctorNotification.save();

    const io = req.app.get('socketio');

    io.to(user._id.toString()).emit('appointmentNotification', {
        _id: patientNotification._id,
        userId: patientNotification.userId,
        message: patientNotification.message,
        read: patientNotification.read,
        createdAt: patientNotification.createdAt,
    });

    io.to(doctorId.toString()).emit('appointmentNotification', {
        _id: doctorNotification._id,
        doctorId: doctorNotification.doctorId,
        message: doctorNotification.message,
        read: doctorNotification.read,
        createdAt: doctorNotification.createdAt,
    });

    res.status(201).json({
        status: 'success',
        data: {
            appointment,
        },
    });
});

// Cancel an appointment
const cancelAppointment = asyncHandler(async (req, res, next) => {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
        return next(new apiError('Appointment not found', 404));
    }

    const doctorId = appointment.doctorId;

    await Doctor.findByIdAndUpdate(
        doctorId,
        {
            $pull: {
                doctorSchedule: {
                    patientID: appointment.patientId,
                    Date: appointment.date,
                    queueNum: appointment.queueNumber,
                },
            },
        },
        { new: true }
    );

    const patient = await User.findById(appointment.patientId);
    const doctor = await Doctor.findById(appointment.doctorId);

    const patientNotification = new Notification({
        userId: appointment.patientId,
        message: `Hello ${patient.name}, your appointment with Dr. ${doctor.name} on ${appointment.date.toISOString().split('T')[0]} has been canceled.`,
    });
    await patientNotification.save();

    const doctorNotification = new Notification({
        doctorId: appointment.doctorId,
        message: `Dr. ${doctor.name}, the appointment with ${patient.name} on ${appointment.date.toISOString().split('T')[0]} has been canceled.`,
    });
    await doctorNotification.save();

    const io = req.app.get('socketio');

    io.to(appointment.patientId.toString()).emit('appointmentNotification', {
        _id: patientNotification._id,
        userId: patientNotification.userId,
        message: patientNotification.message,
        read: patientNotification.read,
        createdAt: patientNotification.createdAt,
    });

    io.to(appointment.doctorId.toString()).emit('appointmentNotification', {
        _id: doctorNotification._id,
        doctorId: doctorNotification.doctorId,
        message: doctorNotification.message,
        read: doctorNotification.read,
        createdAt: doctorNotification.createdAt,
    });

    res.status(201).json({
        Status: 'success',
        Message: 'Appointment deleted successfully',
    });
});

module.exports = {
    getAllAppointments,
    createAppointment,
    cancelAppointment,
};
