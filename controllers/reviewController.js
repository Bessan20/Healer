const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel.js');
const factory = require('./handlersFactory.js');
const apiError = require('../utils/apiError.js');

const getAllReviews = factory.getAll(Review);

const createReview = asyncHandler(async (req, res, next) => {
    
    res.status(201).send("hello");

});

module.exports = {
    
    getAllReviews,
    createReview
}