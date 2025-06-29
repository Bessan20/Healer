const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({

    image : {

        type : String,
        default: 'https://res.cloudinary.com/dfjllx0gl/image/upload/v1744907351/default_ihvlie.jpg',
    },
    name : {
        
        type : String,
        required : true,  
        trim : true,
    },

    nationalID : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
   /* mobilePhone : {
        type : String,
        required : true,
    
    },
    email : {
        type : String,
        required : true,
        unique : true,
        
    },*/
    specialization : {
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

    exp : {
        type : Number,
        default : 1,
    },

    rate : {
        type : Number,
        default : 1,
    },

    reviews : {
        
        
        type : [
            {
                
                reviewText: {
                    type: String,
                },

                rating: {
                    type: Number,
                },

                userName: {
                    type: String,
                },

                userImage: {
                    type: String,
                    default: 'https://res.cloudinary.com/dfjllx0gl/image/upload/v1744907351/default_ihvlie.jpg',
                },
                
            }
        ],
        _id: false,
        default : [],
    },
    workingHours : {

        type : [
            {
                day: {
                    type: String,
                    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                },
                start: {
                    type: String,
                },
                end: {
                    type: String,
                },
            }
        ]
    },
         price : {
        type : Number,
        default : 300,
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