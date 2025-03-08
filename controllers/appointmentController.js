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
    
    //* 6 - create appointment details
    const appointmentDetails = {

        patientID : appointment.patientId,
        Date : appointment.date,
        queueNum : appointment.queueNumber,
    };
    
    //* 7 - push appointment details to doctorSchedule
    const doctorUpdated = await Doctor.findByIdAndUpdate(
        doctorId,
        {
            $push: { doctorSchedule:appointmentDetails  },
        },
        { new: true }
    );  
    
    res.status(201).json({
        status : 'success',
        data : {
            appointment,
        },
    });
});

const cancelAppointment = asyncHandler(async(req,res,next)=>{
    
    //* 1 - Get appointmentId from req.body
    const { appointmentId } = req.body;

    //* 2- find appointment and delete it
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    //* 3 - check if appointment exists
    if(!appointment){
        return next(new apiError('Appointment not found',404));
    };

    //* 4 - find doctor and update doctorSchedule
    const doctorId = appointment.doctorId;

    const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        {
            $pull: { doctorSchedule: {  patientID: appointment.patientId ,Date: appointment.date , queueNum : appointment.queueNumber } },
        },
        { new: true }
    );

    res.status(204).json({
        Status : 'success',
        Message : 'Appointment deleted successfully', 
    });

});
module.exports = {

    getAllAppointments,
    createAppointment,
    cancelAppointment,

}
