// controllers/appointmentController.js

// Import required modules
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory.js');
const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const Doctor = require('../models/doctorModel.js');
const Health = require('../models/healthModel.js');
const Profile = require('../models/profileModel.js');
const Notification = require('../models/Notification');
const apiError = require('../utils/apiError.js');

// Get all appointments using factory handler
const getAllAppointments = asyncHandler(async(req,res,next)=>{

    const appointments = await Appointment.find();
 const detailedAppointments = await Promise.all(
  appointments.map(async (appointment) => {
    const user = await User.findById(appointment.patientId).select('-password');
    let profile = null;
    let debugReason = '';
    if (user) {
      if (user.profileId) {
        profile = await Profile.findById(user.profileId);
        if (!profile) debugReason = 'Profile not found for this profileId';
      } else {
        debugReason = 'User has no profileId';
      }
    } else {
      debugReason = 'User not found';
    }
    return {
      ...appointment.toObject(),
      patient: user,
      profile: profile,
      debugReason: debugReason, // حتظهر ليك السبب في الـ response
    };
  })
);

res.status(200).json({
  status: 'success',
  results: detailedAppointments.length,
  data: detailedAppointments,
});
});

// Create a new appointment
const createAppointment = asyncHandler(async (req, res, next) => {
    
    /*const { doctorId, date } = req.body;

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate)) {
        return next(new apiError('Invalid date format. Please use a valid date (e.g., "2025-04-15").', 400));
    }*/

    const {day , time , bookingFor , gender , relation , problem , doctorId ,
        } = req.body
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new apiError('User not found', 404));
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return next(new apiError('Doctor not found', 404));
    }

    //check if the user has an active health insurance card

   const healthInsurance = await Health.findOne({ userId: user._id });
if (typeof doctor.price !== "number") {
    return next(new apiError("Doctor price is not set correctly.", 400));
}
let priceHealth = 0;
let str = "";
if (healthInsurance) {
    priceHealth = doctor.price - 50;
    if (priceHealth < 0) priceHealth = 0;
    str = "yes";

} else {
    priceHealth = doctor.price;
    str = "no";
}
    const count = await Appointment.countDocuments({
      doctorId: doctorId,
      day: day
      });
     let queueNumber = count + 1;
    const appointment = await Appointment.create({
        
        day,
        time,
        bookingFor,
        gender,
        relation,
        problem,
        patientId: user._id,
        doctorName: doctor.name,
        doctorId: doctor._id,
        doctorImage: doctor.image,
        doctorSpecialization: doctor.specialization,
        healthInsuranceCard : str,
        price : doctor.price,
        priceHealth,
        appointmentID : queueNumber,
    });

    const appointmentDetails = {
        patientID: appointment.patientId,
        Day : appointment.day,
        appointmentId: appointment.appointmentID,
    };

    await Doctor.findByIdAndUpdate(
        doctorId,
        { $push: { doctorSchedule: appointmentDetails } },
        { new: true }
    );

    const patientNotification = new Notification({
        userId: user._id,
        message: `Hello ${user.name}, your appointment with Dr. ${doctor.name} on ${time} ${day} has been booked! Queue: ${appointment.appointmentID}`,
    });
    await patientNotification.save();

    const doctorNotification = new Notification({
        doctorId: doctorId,
        message: `Dr. ${doctor.name}, you have a new appointment with ${user.name} on ${time} ${day}. Queue: ${appointment.appointmentID}`,
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
                    Day : appointment.day,
                    appointmentId: appointment.appointmentID,

                },
            },
        },
        { new: true }
    );

    const patient = await User.findById(appointment.patientId);
    const doctor = await Doctor.findById(appointment.doctorId);

    const patientNotification = new Notification({
        userId: appointment.patientId,
        message: `Hello ${patient.name}, your appointment with Dr. ${doctor.name} on ${appointment.time} ${appointment.day} has been canceled.`,
    });
    await patientNotification.save();

    const doctorNotification = new Notification({
        doctorId: appointment.doctorId,
        message: `Dr. ${doctor.name}, the appointment with ${patient.name} on ${appointment.time} ${appointment.day} has been canceled.`,
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
