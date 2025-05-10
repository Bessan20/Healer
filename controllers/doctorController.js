const factory = require('./handlersFactory.js');
const Doctor = require('../models/doctorModel.js');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError.js');

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

const signToken = (ID) => {
    return jwt.sign({ ID }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

const getAllDoctors = factory.getAll(Doctor);

const signUpDoctor = asyncHandler(async (req, res, next) => {

    let imageUrl = ''; 
    // If an image is provided, upload it to Cloudinary or process it
    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' },
                (error, result) => {
                    if (error) {
                        reject(new Error('Failed to upload image to Cloudinary.'));
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

       imageUrl = result.secure_url; // Store the uploaded image URL
    }
    const doctor = await Doctor.create(...req.body, {image : imageUrl});
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

/*const loginWithEmailDoctor = asyncHandler(async(req,res,next)=>{

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
    
});*/

const getDoctorByName  = asyncHandler(async(req,res,next)=>{

    const {name} = req.query;
    const doctor = await Doctor.find({name : { $regex: name.split('').join('.*'), $options: 'i' }}).select('name -_id');
    if(doctor.length === 0) 
        return next(new apiError('No doctors found with that name.', 404));
    
    res.status(200).json({Status : true , data : doctor});
});

const getDoctorBySpecialization = asyncHandler(async(req,res,next)=>{

    const { specialization } = req.query;

    const doctor = await Doctor.find({
        specialization: { $regex: specialization, $options: 'i' }
    }).select('name specialization -_id');

    if (doctor.length === 0) {
        return next(new apiError('No doctors found with that specialization.', 404));
    }

    
    res.status(200).json({
        Status: true,
        data: doctor
    });
});
module.exports = {

    getAllDoctors,
    signUpDoctor,
    loginWithIdDoctor,
    /*loginWithEmailDoctor,*/
    getDoctorByName,
    getDoctorBySpecialization,
    uploadFile

  
};
