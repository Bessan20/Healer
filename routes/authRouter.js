const express = require('express');
const router = express.Router();

const {

    signUp,
    loginWithId,
    loginWithEmail,

} = require('../controllers/authController.js');

const {

    signUpValidator
} = require('../utils/validators/authValidator.js');

router.route('/signUp').post(signUpValidator,signUp); 
router.route('/loginWithId').post(loginWithId);
router.route('/loginWithEmail').post(loginWithEmail)
module.exports = router;