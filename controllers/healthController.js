const asyncHandler = require("express-async-handler");
const factory = require('./handlersFactory.js');
const Health = require('../models/healthModel.js');
const User = require('../models/userModel.js');
const apiError = require('../utils/apiError.js');

const getHealthInsurance = factory.getAll(Health);

const createHealthInsurance = asyncHandler(async (req, res, next) => {

    const { headFamily, beneficiaryName, healthUnit, fileNumber } = req.body;
    const userId = req.user._id; // Assuming you have the user ID in req.user
    const healthInsurance = await Health.create({
        headFamily,
        beneficiaryName,
        healthUnit,
        fileNumber,
        userId
    });
    res.status(201).json({
        status: 'success',
        data: {
            healthInsurance
        }
    });
});

module.exports = {
    
    getHealthInsurance,
    createHealthInsurance

};
