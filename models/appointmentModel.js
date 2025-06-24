const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    bookingFor : {
        type : String,
        enum : ['self', 'family'],
        required : [true,'The bookingFor field is required.'],
        lowercase : true,
        trim : true,
    },

    gender : {
        type : String,
        default : 'Male',
        lowercase : true,
        trim : true,
    },

    relation : {
        type : String,
        default : 'daughter',
        lowercase : true,
        trim : true,
    },
    
    problem : {
        type : String,
        required : [true, 'The problem field is required.'],
        lowercase : true,
        trim : true,
    },

    patientId : {

        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },

    doctorName : {
        
        type : String,
        trim : true,
        lowercase : true,
    },

    doctorId : {
        
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Doctor',
    },

    doctorImage : {
        
        type : String,
        default : 'https://res.cloudinary.com/dfjllx0gl/image/upload/v1744907351/default_ihvlie.jpg',
        trim : true,
    },

    doctorSpecialization : { 

        type : String,
        trim : true,
        lowercase : true,

    },

    healthInsuranceCard : {
        type : String,
        default : 'no',
        trim : true,
        lowercase : true,
    },

    day : {

        type : String,
        trim : true,
        lowercase : true,
    },

    time : {
        type : String,
        trim : true,
        lowercase : true,
    },

    price : {
        
        type : Number,
        default : 300,
    },

    priceHealth : {
        
        type : Number,
        default : 300,
    },

    appointmentID : {
        
        type : Number,
        default : 1,
    },

},{timestamps : true});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;