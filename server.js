/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED ERROR! Shutting Down!');
  process.exit(1);
});
const app = require(`${__dirname}/app.js`);
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connection sucessful!'));
//console.log(process.env);

const port = process.env.PORT || 3000;

/*app.listen to start up our server
port is the callback function which will be called when the server will be listened */
const server = app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down!');
  server.close(() => {
    process.exit(1);
  });
});
