const express = require('express');
const router = express.Router();
const {
    getHealthInsurance,
    createHealthInsurance ,getHealthInsuranceByUser,
deleteHealthInsurance} = require('../controllers/healthController.js');
const {createHealthValidator} = require('../utils/validators/healthValidator.js');
    const { protect } = require('../controllers/authController.js');

router.route('/getHealthInsurance').get(getHealthInsurance);

router.route('/createHealthInsurance').post(protect, createHealthValidator,createHealthInsurance);

router.route('/getHealthInsuranceByUser').get(protect, getHealthInsuranceByUser);

router.route('/deleteHealthInsurance').delete(protect, deleteHealthInsurance);

module.exports = router;
