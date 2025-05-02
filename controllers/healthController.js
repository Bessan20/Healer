const asyncHandler = require("express-async-handler");
const factory = require('./handlersFactory.js');
const Health = require('../models/healthModel.js');
const User = require('../models/userModel.js');
const apiError = require('../utils/apiError.js');

const getHealthInsurance = factory.getAll(Health);

const createHealthInsurance = asyncHandler(async (req, res, next) => {

    res.send("createHealthInsurance");
});

module.exports = {
    
    getHealthInsurance,
    createHealthInsurance

};
