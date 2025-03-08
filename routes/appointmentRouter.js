const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    createAppointment,
    cancelAppointment,
} = require('../controllers/appointmentController.js');

const { protect } = require('../controllers/authController.js')
router.route('/getAllAppointments').get(getAllAppointments);
router.route('/createAppointment').post(protect,createAppointment);
router.route('/cancelAppointment').delete(protect,cancelAppointment);
module.exports = router;