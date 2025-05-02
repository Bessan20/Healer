const {check , body} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const Health = require('../../models/healthModel.js');

const createHealthValidator = [ 

    check('headFamily')
    .notEmpty()
    .withMessage('Head of the family name is required.')
    .trim()

    ,validatorMiddleware]

module.exports = { 

    createHealthValidator
    
};