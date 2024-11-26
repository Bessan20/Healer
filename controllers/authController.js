const User = require('../models/userModel.js');
const asyncHandler = require('express-async-handler');

const signUp  = asyncHandler(async(req,res,next)=>{

    const user = await User.create(req.body);
    res.status(201).json({Status : true, Message :"User created successfully" , data : {user}})
});

const loginWithId = asyncHandler(async(req,res,next)=>{

    res.status(201).send('hello1');
});

const loginWithEmail = asyncHandler(async(req,res,next)=>{

    res.status(201).send('hello2');
});
module.exports = {

    signUp,
    loginWithId,
    loginWithEmail,

};