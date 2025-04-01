const asyncHandler = require("express-async-handler");
const Social = require("../models/socialModel.js");
const factory = require("./handlerFactory.js");
const apiError = require("../utils/apiError.js");
const multer = require("multer");

const createSocial = asyncHandler(async (req, res, next) => {
    const { photo, fullName, email, phone, married, children, job } = req.body;
    
    if (!photo || !fullName || !email || !phone || !married || !children || !job) {
        return next(new apiError("Please fill in all fields.", 400));
    }
    
    const social = await Social.create({
        photo,
        fullName,
        email,
        phone,
        married,
        children,
        job,
    });
    
    res.status(201).json({
        Status: true,
        Message: "Social information created successfully",
        data: { social },
    });
    }
);