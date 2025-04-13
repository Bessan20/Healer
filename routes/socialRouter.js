const express = require('express');
const router = express.Router();

//*  import controllers
const {

    getAllSocial,
    createSocial,
    uploadFile

} = require('../controllers/socialController.js');

const { signUpValidator } = require('../utils/validators/socialValidator.js');

router.route('/getAllSocial').get(getAllSocial);

router.route('/createSocial').post(uploadFile,signUpValidator,createSocial);

module.exports = router;