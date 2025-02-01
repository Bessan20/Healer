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

    const user = await User.findOne({nationalID}).select('+password');

    if(!user)
        return next(new apiError('Invalid national ID.', 400));

    if(!(await user.comparePasswordInDb(password , user.password)))
    return next(new apiError('Invalid password.', 400));
   
    const token = signToken(user._id);
    res.json({Status : true, Message :"Login successful", token});
});

const loginWithEmail = asyncHandler(async(req,res,next)=>{

    const {email , password } = req.body;

    if(!email)
        return next(new apiError('Please  , enter your email.', 400));
    if(!password)
        return next(new apiError('Please , enter your account password.', 400));

    const user = await User.findOne({email}).select('+password');

    if(!user) 
        return next(new apiError('Invalid email.', 400));
    
    
    if(!(await user.comparePasswordInDb(password , user.password)))
        return next(new apiError('Invalid password.', 400));
    
    const token = signToken(user._id);
    res.json({Status : true, Message :"Login successful", token});
    
});

const forgotPassword = asyncHandler(async(req,res,next)=>{

    
    res.status(200).send('hello')

});
module.exports = {

    signUp,
    loginWithId,
    loginWithEmail,
    forgotPassword,

};