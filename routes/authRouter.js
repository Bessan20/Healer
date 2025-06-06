const express = require('express');
const router = express.Router();

const {

    getAllUsers,
    signUp,
    loginWithId,
    loginWithEmail,
    // forgotPassword,
    // resetPassword,
      protectforget,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,

} = require('../controllers/authController.js');

const {

    signUpValidator,
    resetValidator
} = require('../utils/validators/authValidator.js');

router.route('/getAllUsers').get(getAllUsers);
router.route('/signUp').post(signUpValidator,signUp); 
router.route('/loginWithId').post(loginWithId);
router.route('/loginWithEmail').post(loginWithEmail);
// router.route('/forgotPassword').post(forgotPassword);
// router.route('/resetPassword').post(resetPassword);
router.post("/forgetpass", forgetPassword);
router.post("/verifycode", protectforget, verifyPassResetCode);
router.put("/resetpassword", protectforget, resetValidator, resetPassword);
module.exports = router;