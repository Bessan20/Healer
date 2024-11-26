const asyncHandler = require('express-async-handler');
const apiError = require('../utils/apiError.js');

const getAll = (Model) =>
    
    asyncHandler(async(req,res,next)=>{

        const documents = await documents.find({});
        res.status(200).json({Status : 'success' ,'Number of documents' : documents.length , data : documents });

    });

const createOne = (Model) =>

    asyncHandler(async(req,res,next)=>{

        const document = await Model.create(req.body);
        res.status(201).json({Status : 'success' , data : document})
    });

const getOne = (Model) => 

    asyncHandler(async(req,res,next)=>{

        const document = await Model.findById(req.params.id);
        if(!document) 
            return next(new apiError('No document found with that ID', 404));
        res.status(200).json({Status : 'success' , data : document})
    });

const updateOne = (Model) =>

    asyncHandler(async(req,res,next)=>{

        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true});
        if(!document)
            return next(new apiError('No document found with that ID', 404));
        res.status(200).json({Status : 'success' , data : document})
    });

const deleteOne = (Model) =>

    asyncHandler(async(req,res,next)=>{

        const document = await Model.findByIdAndDelete(req.params.id);
        if(!document)
            return next(new apiError('No document found with that ID', 404));
        res.status(204).json({Status : 'success' , Message : 'One document deleted successfully'});
    });
module.exports = {

    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,

};