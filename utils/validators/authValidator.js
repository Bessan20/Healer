const {check , body} = require('express-validator');
const User = require('../../models/userModel.js');
const validatorMiddleware = require('../../middlewares/validatorMiddleware.js');

const signUpValidator = [

    check('name')
    .notEmpty()
    .withMessage('Name is required.')
    .trim()
    .custom((name) => {
      const regex = /^[a-zA-Z\s]+$/;
      if (!regex.test(name)) {
        throw new Error('Invalid name , it should only contain letters and spaces.');
      }
      return true;
    })
    ,check('nationalID')
    .notEmpty()
    .withMessage('National id is required.')
    .trim()
    .custom((val) =>
        User.findOne({ nationalID: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('This national id  is already exist.'));
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
      .withMessage('Mobile phone number is required.')
      .trim()
      .custom((mobilePhone)=> {
        const regex = /^[0-9]{11}$/;
        if (!regex.test(mobilePhone)) {
          throw new Error('Invalid mobile phone number , it should be 11 digits.');
        }
        return true;
      })
      ,check('email')
      .notEmpty()
      .withMessage('E-mail is required.')
      .isEmail()
      .withMessage('This e-mail is invalid.')
      .custom((val) =>
        User.findOne({ email : val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('This e-mail is  already exist.'));
          }
        })
      )
      ,check('password')
      .notEmpty()
      .withMessage('Password is required.')
      .custom((password)=>{
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
        if (!regex.test(password)) {
          throw new Error('Password should be between (8-15) characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }
        return true;
      })
      ,check('confirmedPassword')
      .notEmpty()
      .withMessage('Confirmation password is required.')
      .custom((confirmedPassword, { req }) => {
        if (confirmedPassword !== req.body.password) {
          throw new Error('Password Confirmation is incorrect.');
        }
        return true;
      })
    ,validatorMiddleware
];

const resetValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 6 characters")
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

      if (!regex.test(newPassword)) {
        throw new Error(
          'Password should be between (8-15) characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation required"),
  validatorMiddleware,
];

module.exports = {

    signUpValidator,
resetValidator
};
