const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

    image : {
        type: String,
        default: 'https://res.cloudinary.com/dxq5jv7xg/image/upload/v1698531538/default_profile.png',
        
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
        default: Date.now,
        
    },
    gender: {
        type: String,
        default :'female'

        
    },
    blood : {
        type: String,
        default: 'O+'
        
    },
    notes : {
        type: String,
        default: 'No notes available'
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;