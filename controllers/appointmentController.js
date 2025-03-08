const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const Appointment = require('../models/appointmentModel');
const apiError = require('../utils/apiError');

const getAllAppointments = factory.getAll(Appointment);

const createAppointment = asyncHandler(async(req,res,next)=>{

    
    console.log(req.user._id);
    console.log(req.user.name);
    
    res.status(201).send(req.user.name);
});

module.exports = {

    getAllAppointments,
    createAppointment,
}
