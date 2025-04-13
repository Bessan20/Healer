const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

    image : {
        type: String,
        default: 'https://res.cloudinary.com/dxq5jv7xg/image/upload/v1698531538/default_profile.png',
        
    },
    fullName: {
        type: String,
        trim : true
        
    },
    nationalID: {
        type: String,
        trim : true,
          
    },
    email: {
        type: String,
        trim : true,
    },
    phone: {
        type: String,
        trim : true,
        
        
    },
    date: {
        type: Date,
        default: Date.now,
        trim : true
        
    },
    gender: {
        type: String,
        default :'female',
        trim : true

        
    },
    blood : {
        type: String,
        default: 'O+',
        trim : true
        
    },
    notes : {
        type: String,
        default: 'No notes available',
        trim : true
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;