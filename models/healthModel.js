const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({

    headFamily : {
        
        type : String,
        required : [true, 'Please enter the head of the family name.'],
        trim : true,
    },
    beneficiaryName : {
        
        type : String,
        required : [true, 'Please enter the beneficiary name.'],
        trim : true,
    },
    healthUnit : {
        
        type : String,
        required : [true, 'Please enter the health unit name.'],
        trim : true,
    },
    fileNumber : {
        
        type : String,
        required : [true, 'Please enter the file number.'],
        unique : [true , 'File number already exists.'],
        trim : true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

} , {
    timestamps: true });

const Health = mongoose.model('Health', healthSchema);
module.exports = Health;
