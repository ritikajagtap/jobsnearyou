/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-dynamic-require
const Job = require(`${__dirname}/../models/jobModel`);
// eslint-disable-next-line import/no-dynamic-require
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/handleFactory`);
//we read our data here also we converted it into json object
/*
const jobs = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/jobs-simple.json`)
);
*/

//AS in the further code, we'll require filtering features and it is not right to copy the code from here ad use it there... so we have created a class
/*const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};*/
exports.getAllJobs = catchAsync(async (req, res, next) => {
  //EXECUTE THE QUERY
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .feilds()
    .pagination();
  const jobs = await features.query;
  /* const jobs = await Job.find().where('type').equals('Internship'); */
  // console.log(req.query, queryObj); //gives us the obbject of the data in query string
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  //findById is the mongoose query and is mentioned in the documentation
  const job = await Job.findById(req.params.id).populate('reviews');
  if (!job) {
    return next(new AppError('No job found of id', 404));
  }

  // Job.findOne({_id: req.params.id})  ///the above can be used as this also
  res.status(200).json({
    status: 'success',
    data: {
      job,
    },
  });
});

//we have here wrapped the async function into a function(fn)
exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      job: newJob,
    },
  });
  /*try {
    //create is the mongoose query and is mentioned in the documentation

    
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }*/
});
exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
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
      data: job,
    },
  });
});
exports.deleteJob = factory.deleteOne(Job);
/*
router.route(
  '/jobs-within/:distance/centre/:latlng/unit/:unit',
  jobsController.getJobsWithin
);*/
//  /jobs-within/:distance/centre/:18.5531985544339,73.94801771824574/unit/:unit
//this  part is remaining
exports.getJobsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(new AppError('Please provide in the format lat,lng', 400));
  }
  const jobs = await Job.find({
    locations: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  //18.55334509847711, 73.94806899493484
  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      data: jobs,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(new AppError('Please provide in the format lat,lng', 400));
  }
  const distances = await Job.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
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
/*
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; //2021
    const plan = await Job.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          $startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numJobStarts: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
}; */
/*
exports.getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { verification: { $toBool: true } } },
      {
        $group: {
          _id: 'Internship',
          numInterniships: { $sum: 1 },
        },
        $group: {
          _id: 'Full-time',
          numInterniships: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
*/
