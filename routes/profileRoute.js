const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController.js');
const {getProfile} = require('../controllers/profileControllers.js');

router.route('/').get(protect, getProfile);
module.exports = router;