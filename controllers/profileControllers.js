const asyncHandler  = require('express-async-handler');
const User = require('../models/userModel.js');

const userProfile = asyncHandler(async (req, res, next) => {

    res.status(200).send(`Hello ${req.user.name}, this is your profile`);
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
module.exports = {

    userProfile,
    getProfile

}