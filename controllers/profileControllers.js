const asyncHandler  = require('express-async-handler');
const User = require('../models/userModel.js');

const getProfile = asyncHandler(async(req,res,next) => {

    res.send(user._id);

});
module.exports = {

    getProfile

}