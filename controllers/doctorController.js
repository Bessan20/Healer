const factory = require("./handlersFactory.js");
const Doctor = require("../models/doctorModel.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError.js");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({ storage });

// Middleware to handle file uploads
const uploadFile = upload.single("image"); // Expecting a single file with the field name "image"

const signToken = (ID) => {
  return jwt.sign({ ID }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const getAllDoctors = factory.getAll(Doctor);

const signUpDoctor = asyncHandler(async (req, res, next) => {
  let imageUrl = "";
  // If an image is provided, upload it to Cloudinary or process it
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (error) {
            reject(new Error("Failed to upload image to Cloudinary."));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrl = result.secure_url; // Store the uploaded image URL
  }
  if (typeof req.body.workingHours === 'string') {
  req.body.workingHours = JSON.parse(req.body.workingHours);
}
  const doctor = await Doctor.create({ ...req.body, image: imageUrl });
  const token = signToken(doctor._id);

  doctor.password = undefined;
  res.status(201).json({
    Status: true,
    Message: "Doctor account  created successfully",
    token,
    data: { doctor },
  });
});

const loginWithIdDoctor = asyncHandler(async (req, res, next) => {
  const { nationalID, password } = req.body;

  if (!nationalID)
    return next(new apiError("Please  , enter your national ID.", 400));
  if (!password)
    return next(new apiError("Please , enter your account password.", 400));

  const doctor = await Doctor.findOne({ nationalID }).select("+password");

  if (!doctor) return next(new apiError("Invalid national ID.", 400));

  if (!(await doctor.comparePasswordInDb(password, doctor.password)))
    return next(new apiError("Invalid password.", 400));

  const token = signToken(doctor._id);
  res.json({ Status: true, Message: "Login successful", token });
});

const protectDoctor = asyncHandler(async (req, res, next) => {
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new apiError("You are not logged in! Please log in to get access.", 401)
    );

  // Verify token
  const decoded = jwt.verify(token, process.env.SECRET_STR);

  // Find doctor
  const doctor = await Doctor.findById(decoded.ID);
  if (!doctor) return next(new apiError("Doctor no longer exists.", 401));

  // Check if password changed recently
  if (
    doctor.passwordChangedAt &&
    Date.now() - doctor.passwordChangedAt < 10 * 60 * 1000
  ) {
    return next(
      new apiError(
        "Password has been changed recently. Please login again.",
        401
      )
    );
  }

  // Attach doctor to req
  req.doctor = doctor;
  next();
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

const getDoctorByName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const doctor = await Doctor.find({
    name: { $regex: name.split("").join(".*"), $options: "i" },
  }).select("image name specialization rate  -_id");
  if (doctor.length === 0)
    return next(new apiError("No doctors found with that name.", 404));

  res.status(200).json({ Status: true, data: doctor });
});

const getDoctorBySpecialization = asyncHandler(async (req, res, next) => {
  const { specialization } = req.query;

  const doctor = await Doctor.find({
    specialization: { $regex: specialization, $options: "i" },
  }).select("image name specialization rate  -_id");

  if (doctor.length === 0) {
    return next(
      new apiError("No doctors found with that specialization.", 404)
    );
  }

  res.status(200).json({
    Status: true,
    data: doctor,
  });
});

const getAllDoctorsBySpecialization = asyncHandler(async (req, res, next) => {
  const { specialization } = req.query;
  let doctors;

  if (specialization) {
    // لو فيه تخصص معين في الـ query
    doctors = await Doctor.find({
      specialization: { $regex: specialization, $options: "i" },
    }).select("-password -__v"); // ممكن تحددي الحقول اللي تظهر
  } else {
    // لو مفيش تخصص معين، رجّع كل الدكاترة
    doctors = await Doctor.find().select("-password -__v");
  }

  if (doctors.length === 0) {
    return next(
      new apiError("No doctors found.", 404)
    );
  }

  res.status(200).json({
    Status: true,
    data: doctors,
  });
});
module.exports = {
  getAllDoctors,
  signUpDoctor,
  loginWithIdDoctor,
  /*loginWithEmailDoctor,*/
  getDoctorByName,
  getDoctorBySpecialization,
  uploadFile,

  protectDoctor,
  getAllDoctorsBySpecialization
};
