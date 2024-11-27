const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError.js');


const signToken = ID =>
    {
        return jwt.sign({ID},process.env.SECRET_STR,{
            expiresIn : process.env.LOGIN_EXPIRES
        });
    };


const signUp  = asyncHandler(async(req,res,next)=>{

    const user = await User.create(req.body);
    const token = signToken(user._id);
    res.status(201).json({Status : true, Message :"User created successfully" , token ,data : {user}})
});

const loginWithId = asyncHandler(async(req,res,next)=>{

    const {nationalID , password } = req.body;

    if(!nationalID)
        return next(new apiError('Please  , enter your national ID.', 400));
    if(!password)
        return next(new apiError('Please , enter your account password.', 400));
});

const loginWithEmail = asyncHandler(async(req,res,next)=>{

    res.status(201).send('hello2');
});
module.exports = {

    signUp,
    loginWithId,
    loginWithEmail,

};