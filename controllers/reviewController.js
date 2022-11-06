const Review = require(`${__dirname}/../models/reviewModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const factory = require(`${__dirname}/handleFactory`);
const AppError = require(`${__dirname}/../utils/appError`);
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.jobId) filter = { job: req.params.jobId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  //findById is the mongoose query and is mentioned in the documentation
  const review = await Review.findById(req.params.id).populate('reviews');
  if (!review) {
    return next(new AppError('No job found of id', 404));
  }

  // Job.findOne({_id: req.params.id})  ///the above can be used as this also
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //nested routes
  if (!req.body.job) req.body.job = req.params.jobId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
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
      data: review,
    },
  });
});