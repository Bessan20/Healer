const express = require('express');
const router = express.Router();

//*  import controllers
const {

    getAllSocial,
    createSocial

} = require('../controllers/socialController.js');

router.route('/getAllSocial').get(getAllSocial);

router.route('/createSocial').post(createSocial);

module.exports = router;