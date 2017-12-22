const nodemailer = require('nodemailer');

exports.send = (to, subject, html) => {
  const { EMAIL, EMAIL_PASSWORD, EMAIL_HOST } = process.env;
  const from = `"Megaphone" ${EMAIL}`
  let options = {
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL, pass: EMAIL_PASSWORD
    }
  };

  // Testing
  if (EMAIL_HOST) {
    delete options.service
    options.host = EMAIL_HOST
  }

  const transporter = nodemailer.createTransport(options);
  return transporter.sendMail({ from, to, subject, html})
}
