const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
    },

    userName : {
        type: String,
        required: true,
        trim: true,
    },

    userImage : {
        type: String,
        required: true,
        trim: true,
    },

    doctorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        trim: true,
    },

    reviewText : {
        type: String,
        required: true,
        trim: true,
    },

    rating : {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        
    },

},{timestamps: true});

const review = mongoose.model('Review', reviewSchema);
module.exports = review;