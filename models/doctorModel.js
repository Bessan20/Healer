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
        type : string,
        required : true,
        unique : true,
        
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
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmedPassword = undefined;
    next();
  });
  
userSchema.methods.comparePasswordInDb = function(pswd,pswdDB){

    return bcrypt.compare(pswd,pswdDB);
 
}

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;