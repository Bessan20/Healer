const {check , body} = require('express-validator');
const Social = require('../../models/socialModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

/*const getvalidatorMiddleware = [

    check('page')
    .optional()
    .isNumeric()
    .withMessage('Page must be a number.'),
    validatorMiddleware]*/

const signUpValidator = [

    check('image')
    .notEmpty()
    .withMessage('Your national id image is required.')
    ,check('fullName')
    .notEmpty()
    .withMessage('Your full name is required.')
    .trim()
    ,check('email')
    .notEmpty()
    .withMessage('Your email is required.')
    .isEmail()
    .withMessage('Your email is invalid.')
    .trim()
    ,check('phone')
    .notEmpty()
    .withMessage('Your phone number is required.')
    //phone number must be 11 digits
    .custom((phone)=> {
        const regex = /^[0-9]{11}$/;
        if (!regex.test(phone)) {
          throw new Error('Invalid mobile phone number , it should be 11 digits.');
        }
        return true;
      })
    .trim()
    ,check('married')
    .notEmpty()
    .withMessage('Your marital status is required.')
    ,check('children')
    .notEmpty()
    .withMessage('Your children status is required.')
    ,check('job')
    .notEmpty()
    .withMessage('Your job title status is required.')
    .trim()
    ,validatorMiddleware
];

module.exports = {
    
    //getvalidatorMiddleware,
    signUpValidator 
}