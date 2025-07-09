const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewsModel.js');
const Doctor = require('../models/doctorModel.js');
const factory = require('./handlersFactory.js');
const apiError = require('../utils/apiError.js');

const getAllReviews = factory.getAll(Review);

const createReview = asyncHandler(async (req, res, next) => {
    
    
    const doctorID = req.params.id;
    const {reviewText , rating } = req.body;
    const review = await Review.create({
        userId: req.user._id,
        userName: req.user.name,
        userImage: req.user.image,
        doctorId: doctorID,
        reviewText: reviewText,
        rating: rating
    });

    await Doctor.findByIdAndUpdate(
            doctorID,
            { $push: { reviews : { reviewText , rating , userName  : req.user.name , userImage : req.user.image , createdAt : review.createdAt} } },
            { new: true }
        );

    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });


});

module.exports = {
    
    getAllReviews,
    createReview
}