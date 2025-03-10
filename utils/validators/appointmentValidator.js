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
modules.exports = {

    createAppointmentValidator
}