const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function schEmail(sub, body) {
console.log('error in email send');
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'automation00987@gmail.com', // Replace with your Gmail email
      pass:  'npholgpblomfmkkg' //'Test123@Auto', //djpvhfgguiqhmsty // Replace with your Gmail password or app password
    },
tls : { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: 'automation00987@gmail.com',
    // to: recipients.join(', '), // Replace with the recipient's email address
    to: ['automation00987@gmail.com'],
    subject: `Reminder new: ${sub}` ,
    text: body ? body : sub,
    // attachments: [{
    //     filename: `${dateTime}.png`, // Replace with the actual filename
    //     content: fs.createReadStream(screenshotPath), // Read the image file
    //   }],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error in email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {schEmail}; // Export the function
