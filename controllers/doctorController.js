const factory = require('./handlersFactory.js');
const Doctor = require('../models/doctorModel.js');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError.js');
const signToken = (ID) => {
    return jwt.sign({ ID }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

const getAllDoctors = factory.getAll(Doctor);

const signUpDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.create(req.body);
    const token = signToken(doctor._id );
    res.status(201).json({
        Status: true,
        Message: 'Doctor account  created successfully',
        token,
        data: { doctor },
    });
});

const loginWithIdDoctor = asyncHandler(async(req,res,next)=>{

    const {nationalID , password } = req.body;

    if(!nationalID)
        return next(new apiError('Please  , enter your national ID.', 400));
    if(!password)
        return next(new apiError('Please , enter your account password.', 400));

    const doctor = await Doctor.findOne({nationalID}).select('+password');

    if(!doctor)
        return next(new apiError('Invalid national ID.', 400));

    if(!(await doctor.comparePasswordInDb(password , doctor.password)))
    return next(new apiError('Invalid password.', 400));
   
    const token = signToken(doctor._id );
    res.json({Status : true, Message :"Login successful", token});
});

const loginWithEmailDoctor = asyncHandler(async(req,res,next)=>{

    const {email , password } = req.body;

    if(!email)
        return next(new apiError('Please  , enter your email.', 400));
    if(!password)
        return next(new apiError('Please , enter your account password.', 400));

    const doctor = await Doctor.findOne({email}).select('+password');

    if(!doctor) 
        return next(new apiError('Invalid email.', 400));
    
    
    if(!(await doctor.comparePasswordInDb(password , doctor.password)))
        return next(new apiError('Invalid password.', 400));
    
    const token = signToken(doctor._id);
    res.json({Status : true, Message :"Login successful", token});
    
});

const getDoctorByName  = asyncHandler(async(req,res,next)=>{

    const {name} = req.params;
    //search by first name with field name
    


    const doctor = await Doctor.findOne({name});
    if(!doctor) 
        return next(new apiError('No doctor found with that name.', 404));
    
    res.status(200).json({Status : true , data : doctor});
});
module.exports = {

    getAllDoctors,
    signUpDoctor,
    loginWithIdDoctor,
    loginWithEmailDoctor,
    getDoctorByName,

  
};
