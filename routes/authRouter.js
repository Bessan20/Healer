const express = require('express');
const router = express.Router();

const {

    signUp,
    loginWithId,
    loginWithEmail,
    forgotPassword,
    resetPassword,

} = require('../controllers/authController.js');

const {

    signUpValidator
} = require('../utils/validators/authValidator.js');

router.route('/signUp').post(signUpValidator,signUp); 
router.route('/loginWithId').post(loginWithId);
router.route('/loginWithEmail').post(loginWithEmail);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword').post(resetPassword);
module.exports = router;