const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    patientName : {
        
        type : String,
        required : true,
    },

    patientMobile : {
        
        type : String,
        required : true,
    },

    patientId : {

        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },

    doctorName : {
        
        type : String,
        required : true,
    },

    doctorId : {
        
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Doctor',
    },

    appointmentDate : {
        
        type : Date,
        required : true,
    },

    queueNumber : {
        
        type : Number,
        required : true,
    },

},{timestamps : true});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;