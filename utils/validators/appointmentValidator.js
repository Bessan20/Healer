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
    .custom((date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date.');
        }
        if (parsedDate < new Date()) {
            throw new Error('Date cannot be in the past.');
        }
        return true;
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