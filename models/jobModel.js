const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const Review = require('./reviewModel');

const jobsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The name is required!'],
      unique: true,
      trim: true, //through this if someone puts the white spaces in the end or in the beginning they'll get cut
      maxlength: [40, 'A job name should have less than 40 characters.'],
    },
    slug: {
      type: String,
    },
    company: {
      type: String,
      required: [true, 'The name is required!'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'The type is required!'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'The type is required!'],
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, 'The eligibily is required!'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'The summary is required!'],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'The cover-image is required!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretJob: {
      type: Boolean,
      default: false,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    role: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobsSchema.index({ locations: '2dsphere' });

//VIRTUAL populate
jobsSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'job', //in reviw model our job id is stored in key 'job' therefore we have written foreignField as job
  localField: '_id',
});

//Document Middleware runs between, .save() and .createMany() or .insertMany()

jobsSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Query Middleware
// /^find/ simply mean all the strings that start with find
/*
jobsSchema.pre(/^find/, function (next) {
  this.find({ secretJob: { $ne: true } });
  this.start = Date.now();
  next();
});
jobsSchema.pre(/^find/, function (docs, next) {
  console.log(`Query took place at ${Date.now() - this.start} miliseconds`);
  console.log(docs);
  next();
}); */
jobsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'recruiter',
    select: '-__v -passwordChangedAt',
  });
  next();
});
jobsSchema.pre('save', function (next) {
  // console.log('Will save Document');
  next();
});

jobsSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});
const Job = mongoose.model('Job', jobsSchema);

module.exports = Job;
