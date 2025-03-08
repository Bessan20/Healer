const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory.js');
const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const Doctor = require('../models/doctorModel.js');
const apiError = require('../utils/apiError.js');

const getAllAppointments = factory.getAll(Appointment);

const createAppointment = asyncHandler(async(req,res,next)=>{

    //* 1 - Get doctorId and appointmentDate from req.body
    const { doctorId , date } = req.body;


    //* 2 - Get user from req.user
    const user = await User.findById(req.user._id);

    //* 3 - Check if user exists
    if(!user){
        return next(new apiError('User not found',404));
    };

    //* 3 - Get doctor from doctorId
    const doctor = await Doctor.findById(doctorId);

    //* 4- Check if doctor exists
    if(!doctor){
        return next(new apiError('Doctor not found',404));
    };

    //* 5 - create appointment
    const appointment = await Appointment.create({
        
        patientName : user.name,
        patientMobile : user.mobilePhone,
        patientId : user._id,
        doctorName : doctor.name,
        doctorId,
        date,
        queueNumber : 1,
    });

    console.log(user.name);

    
    res.status(201).send(req.user.name);
});

module.exports = {

    getAllAppointments,
    createAppointment,
}
