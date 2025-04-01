const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({

    name : {
        
        type : String,
        required : true,  
    },

    nationalID : {
        type : String,
        required : true,
        unique : true,
    },
    mobilePhone : {
        type : String,
        required : true,
    
    },
    email : {
        type : String,
        required : true,
        unique : true,
        
    },
    Specialization : {
        type : String,
        required : true,

    },
    doctorSchedule: {
        type: [
  
            {
              
                patientID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                Date: {
                    type: Date,
                    
                },
                queueNum: {
                    type: Number,
                },
                
            }
        ],
        _id: false,
        default: [] 
    },

    password : {
        type : String,
        required : true,
        select : false

    },
    confirmedPassword : {
        type : String,
        required : true ,
        select : false
    }, 

},{timestamps : true});
doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmedPassword = undefined;
    next();
  });
  
doctorSchema.methods.comparePasswordInDb = function(pswd,pswdDB){

    return bcrypt.compare(pswd,pswdDB);
 
}

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;