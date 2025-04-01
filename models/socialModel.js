const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({

    photo : {
        type: String,
        required: true,
    },

    fullName : {
        type: String,
        required: true,
    },

    email : {
        type: String,
        required: true,
    },

    phone : {
        type: String,
        required: true,
    },

    married : {
        type: String,
        required: true,
        enum: ['yes', 'no'],
    },

    children : {
        type: Number,
        required: true,
    },

    job : {
        type: String,
        required: true,
    },

} , { timestamps: true });

const Social = mongoose.model('Social', socialSchema);
module.exports = Social;