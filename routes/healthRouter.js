const express = require('express');
const router = express.Router();
const {
    getHealthInsurance,
    createHealthInsurance } = require('../controllers/healthController.js');
    const { protect } = require('../controllers/authController.js');

router.route('/getHealthInsurance').get(getHealthInsurance);

router.route('/createHealthInsurance').post(protect, createHealthInsurance);

module.exports = router;
