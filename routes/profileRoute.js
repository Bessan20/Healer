const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController.js');
const {userProfile , getProfile , updateProfile , uploadFile , updateImageProfile , getLastImage} = require('../controllers/profileControllers.js');
//const {userProfileValidator} = require('../utils/validators/profileValidator.js');
router.route('/userProfile').get(protect, userProfile);

router.route('/getProfile').get(protect, getProfile);

router.route('/updateProfile').patch(protect,uploadFile,updateProfile);

router.route('/updateImageProfile').patch(protect,uploadFile,updateImageProfile);

router.route('/getLastImage').get(protect,getLastImage);

module.exports = router;