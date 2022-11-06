const AppError = require(`${__dirname}/../utils/appError`);
/*const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};*/
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppError(message, 400);
};
const handleDoubles = (err) => {
  const message = `The job with the same name exists! `;
  return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  console.error('Error!!!', err);
  let error = Object.assign(err);

  if (error.name === 'CastError') {
    error = handleCastError(error);
  } 
  // if(error.code === 11000)error = handleDoubles(error);
  else {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error: error,
      name: error.name,
    });
  }

  /* if (process.env.NODE_ENV === 'development&&nodemon') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err: err,
    });
  } else if (process.env.NODE_ENV === 'production') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }*/
};
