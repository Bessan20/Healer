const asyncHandler = require("express-async-handler");
const Social = require("../models/socialModel.js");
const factory = require("./handlersFactory.js");
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
const upload = multer({storage});



// Middleware to handle file uploads
const uploadFile = upload.single("image"); // Expecting a single file with the field name "image"

const getAllSocial = factory.getAll(Social);


// Create new social data with file upload
const createSocial = asyncHandler(async (req, res, next) => {
    // Check if a file was uploaded
    console.log("Request body:", req.body); // Debugging line
    console.log("File received:", req.file); // Debugging line

    if (!req.file) {
        return next(new apiError("Please upload an image.", 400));
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
        { folder: "uploads" }, // Folder in Cloudinary
        (error, result) => {
            if (error) {
                return next(new apiError("Failed to upload image to Cloudinary.", 500));
            }
            return result;
        }
    ).end(req.file.buffer);

    console.log(req.body.email)
    console.log(req.body.children)
    console.log(result.secure_url) // Debugging line
    // Create a new social document in the database
    const social = await Social.create({
        photo: result.secure_url, // The URL of the uploaded image from Cloudinary
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        married: req.body.married,
        children: req.body.children,
        job: req.body.job,

    });

     // Debugging line
    res.status(201).json({
        Status: true,
        Message: "Social information created successfully",
        data: social,
    });
});

module.exports = {

    getAllSocial,
    createSocial,
    uploadFile,


}


