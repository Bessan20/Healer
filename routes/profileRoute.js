const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController.js');
const {userProfile , getProfile} = require('../controllers/profileControllers.js');

router.route('/userProfile').get(protect, userProfile);

router.route('/getProfile').get(protect, getProfile);
module.exports = router;