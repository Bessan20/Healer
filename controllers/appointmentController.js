const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory.js');
const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');
const Doctor = require('../models/doctorModel.js');
const apiError = require('../utils/apiError.js');

const getAllAppointments = factory.getAll(Appointment);

const createAppointment = asyncHandler(async(req,res,next)=>{

    //1 - Get doctorId and appointmentDate from req.body
    //const { doctorId , appointmentDate } = req.body;

    //2 - Get user from req.user
    const user = await User.findById(req.user._id);

    console.log(user.name);

    
    res.status(201).send(req.user.name);
});

module.exports = {

    getAllAppointments,
    createAppointment,
}
