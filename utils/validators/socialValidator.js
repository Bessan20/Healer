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

    body('fullName')
    .notEmpty()
    .withMessage('name is required.'),
    validatorMiddleware
];

module.exports = {
    
    //getvalidatorMiddleware,
    signUpValidator 
}