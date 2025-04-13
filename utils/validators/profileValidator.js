const {check , body} = require('express-validator');
const Profile = require('../../models/appointmentModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const userProfileValidator = [
    
    body('fullName')
    .trim()
    ,body('nationalID')
    //national id must be 11 digits
    .custom((nationalID)=> {
        const regex = /^[0-9]{14}$/;
        if (!regex.test(nationalID)) {
          throw new Error('Invalid national id , it should be 14 digits.');
        }
        return true;
      })
      .trim()
      ,body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .trim()
    ,body('phone')
    //phone number must be 11 digits
    .custom((phone)=> {
        const regex = /^[0-9]{11}$/;
        if (!regex.test(phone)) {
          throw new Error('Invalid phone number , it should be 11 digits.');
        }
        return true;
      })
      .trim()
    ,body('gender')
    .trim()
    ,body('blood')
    .trim()
    ,body('notes')
    .trim()
    ,body('date')
    .custom((date)=> {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) {
          throw new Error('Invalid date format , it should be YYYY-MM-DD.');
        }
        return true;
      })
    .trim()
    ,validatorMiddleware]

module.exports = { 
    userProfileValidator
    };

