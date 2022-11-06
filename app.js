/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const jobRouter = require(`${__dirname}/routes/jobRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);
const AppError = require(`${__dirname}/utils/appError`);
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const app = express(); //express here is a function which will add bunch of methods to our app
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const reviewRouter = require(`${__dirname}/routes/reviewRoutes`);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//Serving Static files
app.use(express.static(path.join(__dirname, 'public')));
//const hpp = require('hpp');
//MIDDLEWARES

//to input the data from the client and modify it we need a middleware
//this is the middleware
//console.log(process.env.NODE_ENV);

//Set security Http headers
app.use(helmet());
app.use(cookieParser());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit requests from same api
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this ip plz try in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));

//DATA Sanitization against NoSQL query rejection
app.use(mongoSanitize());

//DATA Sanitization against XSS
app.use(xss());

//Test Middleware
app.use((req, res, next) => {
  //console.log(req.headers);
  console.log(req.cookies)
  next();
});

//ROUTE HANDLERS

/*get is the http method which we are sending as the response ...it is the type of request
get is used to perform the read operation on the data */
/*app.get('/api/v1/jobs', getAllJobs);
app.get('/api/v1/jobs/:id', getJob);
/*to post a new job we use the post method... using post we can send data from the client to the server and we can ideally store it in database */
/*app.post('/api/v1/jobs', createJob);
app.patch('/api/v1/jobs/:id', updateJob);
app.delete('/api/v1/jobs/:id', deleteJob);   */

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
//if the above two doesn't get executed this one will be executed...So if we put it on the top, no matter what the request is this'll get executed
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
//an error handling middleware has four arguments
app.use(globalErrorHandler);
//app.use(globalErrorHandler);

//SERVER

module.exports = app;
