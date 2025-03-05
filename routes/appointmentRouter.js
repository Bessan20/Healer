const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    createAppointment
} = require('../controllers/appointmentController.js');

const { protect } = require('../controllers/authController.js')
router.route('/getAllAppointments').get(getAllAppointments);
router.route('/createAppointment').post(protect,createAppointment);
module.exports = router;