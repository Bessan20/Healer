const {check , body} = require('express-validator');
const Social = require('../../models/socialModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const signUpValidator = [

    check('image')
    .notEmpty()
    .withMessage('National id image is required.')
    ,validatorMiddleware
];

module.exports = signUpValidator;