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

const getHealthInsuranceByUser = asyncHandler(async (req, res, next) => {
    const userId = req.user._id; // Assuming you have the user ID in req.user
    const healthInsurances = await Health.find({ userId }).select('-__v -userId -_id');
    if (!healthInsurances || healthInsurances.length === 0) {
        return next(new apiError('No health insurance found for this user', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            healthInsurances
        }
    });
});

module.exports = {
    
    getHealthInsurance,
    createHealthInsurance,
    getHealthInsuranceByUser

};
