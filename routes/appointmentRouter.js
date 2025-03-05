const express = require('express');
const router = express.Router();
const {
    getAllAppointments
} = require('../controllers/appointmentController.js');

router.route('/getAllAppointments').get(getAllAppointments);
module.exports = router;