const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

const filterObj = (obj, ...alowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const jobs = await User.find();
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  //1] Create error if user posts a password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates! Plz used to updateMyPassword route!',
        400
      )
    );
  }
  //Filtered Out the fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  //2]Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success'
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This part is not yet completed',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This part is not yet completed',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This part is not yet completed',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This part is not yet completed',
  });
};
