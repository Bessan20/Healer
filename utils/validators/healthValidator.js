const {check , body} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const Health = require('../../models/healthModel.js');

const createHealthValidator = [ 

    check('headFamily')
    .notEmpty()
    .withMessage('Head of the family name is required.')
    .trim()
    ,check('beneficiaryName')
    .notEmpty()
    .withMessage('Beneficiary name is required.')
    .trim()
    ,check('healthUnit')
    .notEmpty()
    .withMessage('Health unit is required.')
    .trim()
    ,check('fileNumber')
    .notEmpty()
    .withMessage('File number is required.')
    .trim()
    //should be unique
    .custom((val)=>
    
        Health.findOne({fileNumber: val}).then((health)=>
            {
                if(health){
                    return Promise.reject(new Error('File number already exists.'))
                }
            }
        ))

    ,validatorMiddleware]

module.exports = { 

    createHealthValidator
    
};