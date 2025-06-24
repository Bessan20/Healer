const express = require('express');
const router = express.Router();

const protect = require('../controllers/authController.js');
const {

    getAllReviews,
    createReview

} = require('../controllers/reviewController.js');

router.route('/getAllReviews').get(getAllReviews);
router.route('/createReview').post(protect, createReview);

module.exports = router;

