const asyncHandler = require("express-async-handler");
const Social = require("../models/socialModel.js");
const factory = require("./handlersFactory.js");
const apiError = require("../utils/apiError.js");
const multer = require("multer");

fileName = "";
const myStorage = multer.diskStorage({

    destination : './uploads',
    filename : (req , file , redirect) => {

        let date = Date.now();
        let fl = date + '.' + file.mimeType.split('/')[1];
        redirect(null , fl);
        fileName = fl;


    }
});

const upload = multer({storage : myStorage});

const getAllSocial = factory.getAll(Social);

const createSocial = (upload.any('image'),asyncHandler(async (req, res, next) => {
    
    
    res.status(201).json({
        Status: true,
        Message: "Social information created successfully",
       
    });
    }
));

module.exports = {

    getAllSocial,
    createSocial


}


