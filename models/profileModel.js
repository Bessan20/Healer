const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

    image : {
        type: String,
        
    },
    fullName: {
        type: String,
        
    },
    nationalID: {
        type: String,
        
    },
    email: {
        type: String,
        
    },
    phone: {
        type: String,
        
    },
    date: {
        type: Date,
        
    },
    gender: {
        type: String,
        
    },
    blood : {
        type: String,
        
    },
    notes : {
        type: String,
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;