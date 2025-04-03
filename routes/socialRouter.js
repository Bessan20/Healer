const express = require('express');
const router = express.Router();

//*  import controllers
const {

    getAllSocial,
    createSocial,
    uploadFile

} = require('../controllers/socialController.js');

router.route('/getAllSocial').get(getAllSocial);

router.route('/createSocial').post(uploadFile,createSocial);

module.exports = router;