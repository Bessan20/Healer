const asyncHandler  = require('express-async-handler');
const User = require('../models/userModel.js');

const getProfile = asyncHandler(async(req,res,next) => {

    res.send(`Hello<br><b>${req.user.name}</b>`);

});
module.exports = {

    getProfile

}