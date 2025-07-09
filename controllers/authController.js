const factory = require("./handlersFactory.js");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/apiError.js");
const sendEmail = require("../utils/email.js");
const crypto = require("crypto");
const CryptoJs = require("crypto-js");

const signToken = (ID) => {
  return jwt.sign({ ID }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const getAllUsers = factory.getAll(User);

const signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = signToken(user._id);
  res.status(201).json({
    Status: true,
    Message: "User created successfully",
    token,
    data: { user },
  });
});

const loginWithId = asyncHandler(async (req, res, next) => {
  const { nationalID, password } = req.body;

  if (!nationalID)
    return next(new apiError("Please  , enter your national ID.", 400));
  if (!password)
    return next(new apiError("Please , enter your account password.", 400));

  const user = await User.findOne({ nationalID }).select("+password");

  if (!user) return next(new apiError("Invalid national ID.", 400));

  if (!(await user.comparePasswordInDb(password, user.password)))
    return next(new apiError("Invalid password.", 400));

  const token = signToken(user._id);
  user.password = undefined; // Remove password from response
  res.json({ Status: true, Message: "Login successful", token , data : { user } });
});

const loginWithEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new apiError("Please  , enter your email.", 400));
  if (!password)
    return next(new apiError("Please , enter your account password.", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new apiError("Invalid email.", 400));

  if (!(await user.comparePasswordInDb(password, user.password)))
    return next(new apiError("Invalid password.", 400));

  const token = signToken(user._id);
  res.json({ Status: true, Message: "Login successful", token , data: { user } });
});

// const forgotPassword = asyncHandler(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//         return next(new apiError('We could not find the user with given email', 404));
//     }

//     // Generate a 4-digit verification code
//     const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
//     user.passwordResetToken = verificationCode;
//     user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
//     await user.save({ validateBeforeSave: false });

//     // Send the verification code via email
//     const message = `Your password reset verification code is: ${verificationCode}. This code is valid for 10 minutes.`;

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Password Reset Verification Code',
//             message: message,
//         });

//         res.status(200).json({
//             status: 'success',
//             message: 'Verification code sent to the user email',
//         });
//     } catch (err) {
//         user.passwordResetToken = undefined;
//         user.passwordResetTokenExpires = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new apiError('There was an error sending the verification code. Please try again later.', 500));
//     }

// });

// const resetPassword = asyncHandler(async (req, res, next) => {
//     const { verificationCode, password, confirmPassword } = req.body;

//     if (!verificationCode)
//         return next(new apiError('Please provide the verification code.', 400));

//     const user = await User.findOne({
//         passwordResetToken: verificationCode,
//         passwordResetTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//         return next(new apiError('Invalid or expired verification code.', 400));
//     }

//     if (password !== confirmPassword) {
//         return next(new apiError('Passwords do not match', 400));
//     }

//     user.password = password;
//     user.confirmPassword = confirmPassword;
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpires = undefined;
//     user.passwordChangedAt = Date.now();

//     await user.save();

//     res.status(200).json({
//         status: 'success',
//         message: 'Password reset successfully',
//     });
// });

const protectforget = asyncHandler(async (req, res, next) => {
  //1)check if token exists, if exists get
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return next(
      new apiError(
        "you are not login, please login to get accsess this route",
        401
      )
    );
  }
  //2) verify token (no change happens, expired token)
  token = CryptoJs.AES.decrypt(token, process.env.HASH_PASS);
  token = token.toString(CryptoJs.enc.Utf8);

  const decoded = jwt.verify(token, process.env.SECRET_STR);
  //3) check if user exists
  const currentUser = await User.findById(decoded.ID);
  // console.log(currentUser.passwordChangeAt.getTime());
  if (!currentUser) {
    return next(
      new apiError("The user that belong to this token does no longer exist"),
      401
    );
  }

  //   //4)check the user is active or no
  //   if (!currentUser.active) {
  //     return next(
  //       new apiError("The user that belong to this token no active now"),
  //       401
  //     );
  //   }
  //5) check if user change his password after token created
  if (currentUser.passwordChangeAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangeAt / 1000,
      10
    );
    //Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new apiError("Your password has changed recently, please login again"),
        401
      );
    }
  }
  req.user = currentUser;
  next();
});

const forgetPassword = asyncHandler(async (req, res, next) => {
  //1)get user by email
  const user = await User.findOne({ email: req.body.Email });

  if (!user) {
    return next(
      new apiError(`There is no user with that email ${req.body.Email}`, 404)
    );
  }
  //2) if user exit, generate reset random 6 digits and save it in db
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  //Save hashed password reset code into db
  user.passwordResetCode = hashResetCode;
  //Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},\nWe received a  request to reset the password on your Healer Account.\n${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your account secure.\nThe Healer Team `;
  //3) Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new apiError("There is an error in sending email", 500));
  }
  token = signToken(user._id);

  token = CryptoJs.AES.encrypt(token, process.env.HASH_PASS).toString();
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email", token });
});

const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  //1)Get user based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findById(req.user._id);
  if (
    user.passwordResetCode != hashResetCode ||
    user.passwordResetExpires <= Date.now()
  ) {
    return next(new apiError("Reset code invalid or expired"), 401);
  }
  // const user = await User.findOne({
  //   passwordResetCode: hashResetCode,
  //   passwordResetExpires: { $gt: Date.now() },
  // });
  // if (!user) {
  //   return next(new ApiError("Reset code invalid or expired"));
  // }

  //2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();
  const token = req.headers.authorization;

  res.status(200).json({
    status: "Success",
    token,
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  //1)Get user based on email
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new apiError(`There is no user with email ${user.email}`, 404));
  }

  //2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new apiError(`Reset code not verified`, 400));
  }

  const { newPassword } = req.body;

  if (newPassword) {
    user.password = newPassword;
  }

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //3) if everything is ok, generate token
  const token = signToken(user._id);
  res.status(200).json({ token });
});

const protect = asyncHandler(async (req, res, next) => {
  //* 1)check if token exists , if exists get it
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token)
    return next(
      new apiError("You are not logged in! Please log in to get access.", 401)
    );

  //* 2)Verification token
  const decoded = jwt.verify(token, process.env.SECRET_STR);
  req.user = await User.findById(decoded.ID);
  /*console.log(req.user._id);
        console.log(req.user.nationalID);*/

  //* 3)check if user exists
  const currentUser = await User.findById(decoded.ID);
  if (!currentUser) return next(new apiError("User no longer exists.", 401));

  //* 4)check if user changed password
  if (
    currentUser.passwordChangedAt &&
    Date.now() - currentUser.passwordChangedAt < 10 * 60 * 1000
  ) {
    return next(
      new apiError(
        "Password has been changed recently. Please login again.",
        401
      )
    );
  }

  next();
});

module.exports = {
  getAllUsers,
  signUp,
  loginWithId,
  loginWithEmail,
  // forgotPassword,
  // resetPassword,
  protect,
  protectforget,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
};
