/* eslint-disable import/no-dynamic-require */
const express = require('express');
//here we have immported this into the one object then all of the data that was on exports is now gonna be on jobsController
const jobsController = require(`${__dirname}/../controllers/jobsController.js`);
const authController = require(`${__dirname}/../controllers/authController`);
// const reviewController = require(`${__dirname}/../controllers/reviewController`);
const reviewRouter = require(`${__dirname}/../routes/reviewRoutes`);
//here this process is called mounting the routes
const router = express.Router();

//router.param('id', jobsController.checkID);
//router.route('/jobs-stats').get(jobsController.getJobStats);
//router.route('/monthly-plan/:year').get(jobsController.getMonthlyPlan);

router.use('/:jobId/reviews', reviewRouter);

router
  .route('/')
  .get(jobsController.getAllJobs)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'recruiter', 'headRecruiter'),
    jobsController.createJob
  );

router
  .route('/jobs-within/:distance/centre/:latlng/unit/:unit')
  .get(jobsController.getJobsWithin);
router.route('/distances/:latlng/unit/:unit').get(jobsController.getDistances);

router
  .route('/:id')
  .get(jobsController.getJob)
  .patch(jobsController.updateJob)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'recruiter', 'headRecruiter'),
    jobsController.deleteJob
  );

module.exports = router;
