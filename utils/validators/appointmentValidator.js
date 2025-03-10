const {check , body} = require('express-validator');
const Appointment = require('../../models/appointmentModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');


const createAppointmentValidator = [ 

    check('doctorId')
    .notEmpty()
    .withMessage('Doctor id is required.')
    .trim()
    .isMongoId()
    .withMessage('Invalid doctor id.')
    ,validatorMiddleware]

const cancelAppointmentValidator = [ 
    
    check('appointmentId')
    .notEmpty()
    .withMessage('Appointment id is required.')
    .trim()
    .isMongoId()
    .withMessage('Invalid appointment id.')
    ,validatorMiddleware]

    module.exports = {

    createAppointmentValidator,
    cancelAppointmentValidator
}