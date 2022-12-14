const nodemailer = require('nodemailer');
// Uncomment below for local hosting
// require('dotenv').config();

const sendMail = async (html) => {
  const transporter = nodemailer.createTransport({
    name: 'nothing',
    service: 'hotmail',
    auth: {
      user: process.env.SENDERUSERNAME,
      pass: process.env.SENDERPASSWORD,
    },
    debug: false,
    logger: true,
  });

  const mailOptions = {
    from: process.env.SENDERUSERNAME,
    to: process.env.RECEIVERUSERNAME,
    subject: 'Sending Email using Node.js',
    html: `<body>${html}</body>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendMail;
