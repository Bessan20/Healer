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
    ,check('date')
    .notEmpty()
    .withMessage('Date is required.')
    .trim()
    .isDate()
    .withMessage('Invalid date.')
    //ENSURE DATE IS NOT IN THE PAST
    .custom(async (date) => {
        if (new Date(date) < new Date()) {
            throw new Error('Date cannot be in the past.');
        }
    })
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