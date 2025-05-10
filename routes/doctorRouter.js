const express = require('express');
const router = express.Router();

//*  import controllers 
const {

    getAllDoctors,
    signUpDoctor,
    loginWithIdDoctor,
    /*loginWithEmailDoctor,*/
    getDoctorByName,
    getDoctorBySpecialization,
    uploadFile
} =
    require('../controllers/doctorController.js');

//*  import validator

/*const {

    signUpValidator
} = require('../utils/validators/doctorValidator.js');*/

router.route('/getAllDoctors').get(getAllDoctors);

router.route('/searchByName/:name').get(getDoctorByName);

router.route('/searchBySpecialization/:specialization').get(getDoctorBySpecialization);

router.route('/signUp').post(/*signUpValidator,*/uploadFile, signUpDoctor);

router.route('/loginWithId').post(loginWithIdDoctor);

//router.route('/loginWithEmail').post(loginWithEmailDoctor);



module.exports = router;