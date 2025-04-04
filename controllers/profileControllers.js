const asyncHandler  = require('express-async-handler');
const User = require('../models/userModel.js');

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

    getProfile

}