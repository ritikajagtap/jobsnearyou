const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1] Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2]Define email options
  const mailOptions = {
    from: 'Ritika Jagtap <ritika.jagtap.2002@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //3]Actually send the email
  //this returns promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
