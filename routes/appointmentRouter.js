const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    createAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController.js');

const {createAppointmentValidator , cancelAppointmentValidator} = require('../utils/validators/appointmentValidator.js');
const { protect } = require('../controllers/authController.js')
router.route('/getAllAppointments').get(getAllAppointments);
router.route('/createAppointment').post(protect,createAppointmentValidator,createAppointment);
router.route('/cancelAppointment').delete(protect,cancelAppointmentValidator,cancelAppointment);
module.exports = router;