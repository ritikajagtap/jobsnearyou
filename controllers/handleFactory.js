const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //findByIdAndDelete is the mongoose query and is mentioned in the documentation
    const document = await Model.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        return next(new AppError('No job found of id', 404));
      }
    });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) => {
  catchAsync(async (req, res, next) => {
    //findByIdAndUpdate is the mongoose query and is mentioned in the documentation

    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
      (err) => {
        if (err) {
          return next(new AppError('No document found of id', 404));
        }
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
/*
exports.deleteJob = catchAsync(async (req, res, next) => {
  //findByIdAndDelete is the mongoose query and is mentioned in the documentation
  const job = await Job.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(new AppError('No job found of id', 404));
    }
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});*/
