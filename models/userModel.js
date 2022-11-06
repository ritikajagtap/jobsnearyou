const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//username, email,  name, photo, password, passwordConfirm, experience boolean, what experience, location
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'The name is required!'],
    unique: [true, 'The same username already exists!'],
    trim: true,
    maxlength: [40, 'A username should have less than 40 characters.'],
  },
  name: {
    type: String,
    required: [true, 'The name is required!'],
    trim: true,
    maxlength: [40, 'A job name should have less than 40 characters.'],
  },
  email: {
    type: String,
    required: [true, 'The name is required!'],
    unique: [true, 'You are already registered!!'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a Valid email'],
  },
  profileImg: {
    type: String,
    //required: [true, 'The cover-image is required!'],
  },
  role: {
    type: String,
    enum: ['user', 'recruiter', 'recruiterHead', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please enter a password'],
    minlength: [8, 'Password shall be of atleast 8 letters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      //this only works on save
      validator: function (el) {
        return el === this.password; //
      },
      message: 'Passwords are not same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //run this function, if password was modified
  if (!this.isModified('password')) return next();
  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12); //has returns a promise
  //delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
/*
userSchema.methods.changedPasswordsAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //false means not changed... that means the time at which the token was issued is less than the time stamp!
  return false;
};*/
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
userSchema.pre(/^find/, function (next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
