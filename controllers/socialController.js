const asyncHandler = require("express-async-handler");
const Social = require("../models/socialModel.js");
const factory = require("./handlersFactory.js");
const apiError = require("../utils/apiError.js");
const multer = require("multer");

const getAllSocial = factory.getAll(Social);

const createSocial = asyncHandler(async (req, res, next) => {
    
    
    res.status(201).json({
        Status: true,
        Message: "Social information created successfully",
       
    });
    }
);

module.exports = {

    getAllSocial,
    createSocial


}


