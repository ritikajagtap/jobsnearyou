/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const Job = require(`${__dirname}/../../models/jobModel`);
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
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

//Read json file and converting it into object
const jobs = JSON.parse(
  fs.readFileSync(`${__dirname}/jobs-simple.json`, 'utf-8')
);

//Import data into the database
const importData = async () => {
  try {
    //creating document in our db and pushing the object inside it
    await Job.create(jobs);
    console.log('Data Succssfully loaded!');
    process.exit(); //its the way of stoping the function
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Job.deleteMany();
    console.log('All Documents Deleted!');
    process.exit(); //its the way of stoping the function
  } catch (err) {
    console.log(err);
  }
};
//process.argv is the array, where the 2nd element is what we are writing, so first we console.logged process.argv to see what is there in the array process.argv there were two elements the third will be the user input
if (process.argv[2] === '--import') {
  importData();
  console.log('Data Imported Sucessfully!');
} else if (process.argv[2] === '--delete') {
  deleteData();
  console.log('Data deleted Sucessfully!');
}
console.log(process.argv);
