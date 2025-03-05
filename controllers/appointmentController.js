const asyncHandler = require('express-async-handler');
const factory = require('./handlerFactory');
const Appointment = require('../models/appointmentModel');
const apiError = require('../utils/apiError');

const getAllAppointments = factory.getAll(Appointment);

module.exports = {

    getAllAppointments
}
