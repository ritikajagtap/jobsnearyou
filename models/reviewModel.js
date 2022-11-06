const mongoose = require('mongoose');
const validator = require('validator');
const Job = require('./jobModel');
const User = require('./userModel');
//review, createdAt, Ref to job, ref to user,
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'Review must belong to a job!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a job!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ job: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'job',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name profileImg',
  //   });
  this.populate({
    path: 'user',
    select: 'name profileImg',
  });
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
