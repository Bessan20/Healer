const {check , body} = require('express-validator');
const User = require('../../models/userModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const signUpValidator = [

    check('nationalID')
    .notEmpty()
    .withMessage('Your national id is required.')
    .custom((val) =>
        User.findOne({ nationalID: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('National id  already exist.'));
          }
        })
      )
      .custom((nationalID)=>{
        const regex = /^[0-9]{14}$/;
        if (!regex.test(nationalID)) {
          throw new Error('Invalid National id ,it should be 14 digits.');
        }
        return true;
      })
      ,check('mobilePhone')
      .notEmpty()
      .withMessage('Your mobile phone number is required.')
      .custom((mobilePhone)=> {
        const regex = /^[0-9]{11}$/;
        if (!regex.test(mobilePhone)) {
          throw new Error('Invalid mobile phone number , it should be 11 digits.');
        }
        return true;
      })
    ,validatorMiddleware
];

module.exports = {

    signUpValidator,

};