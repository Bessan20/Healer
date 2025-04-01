const express = require('express');
const router = express.Router();

//*  import controllers 
const {

    getAllDoctors,
    signUpDoctor,
    loginWithIdDoctor,
    loginWithEmailDoctor,
    getDoctorByName
} =
    require('../controllers/doctorController.js');

//*  import validator

const {

    signUpValidator
} = require('../utils/validators/doctorValidator.js');

router.route('/getAllDoctors').get(getAllDoctors);

router.route('/signUp').post(signUpValidator, signUpDoctor);

router.route('/loginWithId').post(loginWithIdDoctor);

router.route('/loginWithEmail').post(loginWithEmailDoctor);

router.route('/getDoctorByName/:name').get(getDoctorByName);

module.exports = router;