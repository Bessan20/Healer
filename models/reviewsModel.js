const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,
    },

    userName : {
        type: String,
        trim: true,
    },

    userImage : {
        type: String,
        trim: true,
    },

    doctorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        trim: true,
    },

    reviewText : {
        type: String,
        trim: true,
    },

    rating : {
        type: Number,
        min: 1,
        max: 5,
        
    },

},{timestamps: true});

const review = mongoose.model('Review', reviewSchema);
module.exports = review;