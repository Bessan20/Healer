const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController.js');
const {userProfile , getProfile , updateProfile , uploadFile} = require('../controllers/profileControllers.js');
//const {userProfileValidator} = require('../utils/validators/profileValidator.js');
router.route('/userProfile').get(protect, userProfile);

router.route('/getProfile').get(protect, getProfile);

router.route('/updateProfile').patch(protect,uploadFile,updateProfile);

module.exports = router;