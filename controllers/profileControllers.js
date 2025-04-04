const asyncHandler  = require('express-async-handler');
const factory = require("./handlersFactory.js");
const apiError = require("../utils/apiError.js");
const User = require('../models/userModel.js');
const Profile = require('../models/profileModel.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({storage});

// Middleware to handle file uploads
const uploadFile = upload.single("image"); // Expecting a single file with the field name "image"

const userProfile = asyncHandler(async (req, res, next) => {

    res.status(200).send(`Hello ${req.user.name}`);
});
const getProfile = asyncHandler(async(req,res,next) => {

    res.status(200).json({
        success: true,
       data : {
            name: req.user.name,
            nationalID : req.user.nationalID,
            mobilePhone: req.user.mobilePhone,
            email: req.user.email,
       }
    });

});

const updateProfile = asyncHandler(async(req,res,next)=>{

    const userId = req.user._id;

    //get req.body data
    const data = req.body;

    //if profile not exist create new one
    const profile = await Profile.findOne({userId});
    
    if(!profile) {

       /* const newProfile = await Profile.create({
            fullName : req.user.name,
            nationalID : req.user.nationalID,
            email : req.user.email,
            phone : req.user.mobilePhone,
            userId : req.user._id,
        });*/
        return next(new apiError('Profile not found', 404));
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
    });

});
module.exports = {

    userProfile,
    getProfile,
    updateProfile,
    uploadFile,
}