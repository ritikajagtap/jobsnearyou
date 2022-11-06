const express = require('express');
const router = express.Router();
const Job = require(`${__dirname}/../models/jobModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
exports.getBase = (req, res) => {
  res.status(200).render('section');
};
exports.getOverview = catchAsync(async (req, res) => {
  //1]Get the job data from our collection
  const jobs = await Job.find();
  //2 Build template

  //3] Render that template using job data from step 1
  res.status(200).render('overview', {
    title: 'All Jobs',
    jobs,
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  //1]get the data for the requested job
  const job = await Job.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review user',
  });

  //2]Build template

  //3] render template using the data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('job', {
      job,
    });
});
exports.getLoginForm = (req, res) => {
  res.status(200).set(
    'Content-Security-Policy',
    "connect-src 'self' https://cdnjs.cloudflare.com"
  )
    .render('login', {
      title: 'Log into your account!'
    })
}