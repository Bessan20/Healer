const {check , body} = require('express-validator');
const Profile = require('../../models/appointmentModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const userProfileValidator = [
    check('fullName')
    .trim()
    ,validatorMiddleware]

module.exports = { 
    userProfileValidator
    };

