const express = require('express');
const router = express.Router();
const {
    getHealthInsurance,
    createHealthInsurance ,getHealthInsuranceByUser} = require('../controllers/healthController.js');
const {createHealthValidator} = require('../utils/validators/healthValidator.js');
    const { protect } = require('../controllers/authController.js');

router.route('/getHealthInsurance').get(getHealthInsurance);

router.route('/createHealthInsurance').post(protect, createHealthValidator,createHealthInsurance);

router.route('/getHealthInsuranceByUser').get(protect, getHealthInsuranceByUser);

module.exports = router;
