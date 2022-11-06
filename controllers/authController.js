/* eslint-disable import/no-dynamic-require */
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);
const jwt = require('jsonwebtoken');
const sendEmail = require(`${__dirname}/../utils/email`);
const crypto = require('crypto');
const { promisify } = require('util');

const catchAsync = require(`${__dirname}/../utils/catchAsync`);
//const catchAsync = require(`${__dirname}/../utils/catchAsync`);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
 // if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions);
  //removing password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1] Check if the email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email or password!'));
  }
  //2]Check if user exists and the password is correct
  const user = await User.findOne({ email }).select('+password'); //when we want a field that is by default not selected in database we add + there
  if (!user || !(await user.correctPasswords(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  console.log(user);
  //3]if everything is OK send the token jwt back to the client
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  //1]Getting the token and checking if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }else if(req.cookies.jwt){
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Access Denied! You are not logged in', 401));
  }
  //2]valiidating the token (verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  //3]Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User doesnt exist!', 401));
  }
  //4] check if user changed password after jwt was issued
  /* if (currentUser.changedPasswordsAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed the password, plz login again!', 401)
    );
  }*/
  req.user = currentUser;
  next();
});
//as the restrictTo is a mddleware function and we can't pass arguments in there for roles so we will create a wrapper function which will return the middleware function that we want to create... (...roles) create a array of all the argumennts that were specified
exports.restrictTo = (...roles) => {
  //this below is the middleware function and it has the access to the roles
  return (req, res, next) => {
    //roles is an array roles['admin', 'recruiter', 'headRecruiter']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have access to perform this action!', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No Account with this email address!', 404));
  }
  //generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it back in the email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password, submit a patch req with your new password and password confirmed to ${resetURL}.\n If you didn't forget your password, please ignore this email. `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token, only valid for 10 minutes',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1]get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log('Thiis is the user: ', user);
  //2]If token has not expired and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3]Update the changedPasswordAt property for the user

  //4] Log the user in
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1] Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  //2]Check if Posted current password is correct
  if (!(await user.correctPasswords(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 400));
  }
  //3]If so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //Log user in send JWT
  createSendToken(user, 200, res);
});
