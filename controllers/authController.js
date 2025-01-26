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

    if(!user || !(await user.comparePasswordInDb(password , user.password)))
        return next(new apiError('Invalid national ID or password.', 400));

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

    if(!user || !(await user.comparePasswordInDb(password , user.password)))
        return next(new apiError('Invalid email or password.', 400));

    const token = signToken(user._id);
    res.json({Status : true, Message :"Login successful", token});
    
});

const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new apiError('We could not find the user with given email', 404));
    }

    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.passwordResetToken = verificationCode;
    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send the verification code via email
    const message = `Your password reset verification code is: ${verificationCode}. This code is valid for 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Verification Code',
            message: message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent to the user email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new apiError('There was an error sending the verification code. Please try again later.', 500));
    }
});

const resetPassword = asyncHandler(async (req, res, next) => {
    const { verificationCode, password, confirmPassword } = req.body;

    if (!verificationCode)
        return next(new apiError('Please provide the verification code.', 400));

    const user = await User.findOne({
        passwordResetToken: verificationCode,
        passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new apiError('Invalid or expired verification code.', 400));
    }

    if (password !== confirmPassword) {
        return next(new apiError('Passwords do not match', 400));
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully',
    });
});
module.exports = {

    signUp,
    loginWithId,
    loginWithEmail,
    forgotPassword,
    resetPassword,

};