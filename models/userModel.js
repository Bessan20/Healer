const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');

//National ID - Mobile Phone - Email address - password - confirm password
const userSchema = new mongoose.Schema({

    name : {

        type : String,
        required : true,
    },
    nationalID : {
        type : String,
        required : [true , "Please , Enter your national id."],
        unique : [true , "Please , Enter unique id."],
        validate : {

            validator : (v) => {
                const regex = /^[0-9]{14}$/;
                return regex.test(v);
            },
            message : "National ID should be 14 digits."

        }

    },
    mobilePhone : {
    
        type : String ,
        required : [true , "Please , Enter your mobile phone."],
        validate : {
            validator : (v) => {
                const regex = /^[0-9]{11}$/;
                return regex.test(v);
            },
            message : "Mobile phone should be 11 digits."
        }
    },
    email : {
        type : String,
        required : [true ,"Please , Enter your email."],
        unique : [true , "Please , Enter unique email."],
        validate : [validator.isEmail,"Please , Enter a valid Email."],
        
    },
    password : {
        type : String,
        required : [true , "Please , enter a password"],
        minlength : [8 , "Password should at least 8 characters."],
        //maxlength : [15 , "Password should at most 15 characters."],
        validate : {
            validator : (v) => {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
                return regex.test(v);
            },
            message : "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        },
        select : false

    },
    confirmedPassword : {
        type : String,
        required : [true , "Please , Confirm your password."],
        select : false,
        validate : {
            validator : function(value) {
                return value === this.password;
            },
            message : "Passwords do not match.",
        }
    }, 
    passwordChangedAt: {
        type:Date
    },
    passwordResetToken: {
        type: String,
      },
      passwordResetTokenExpires: {
        type: Date,
      },
    }, { timestamps: true });


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

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    console.log(resetToken, this.passwordResetToken);

    return resetToken;
};

const User = mongoose.model('User',userSchema);
module.exports = User;