const nodemailer = require('nodemailer');

const EMAIL_SERVICE='smtp.ethereal.email'
const EMAIL='rbxou4rilv2ifu7h@ethereal.email'
const EMAIL_PASSWORD='KGkwfamWQEqcu5yTp9'
const to='jkrclaro@outlook.com'
const subject = 'hello'
const html = 'hi'

const options = {
  host: EMAIL_SERVICE,
  port: 587,
  secure: false,
  auth: {
    user: EMAIL, pass: EMAIL_PASSWORD
  }
};
const mail = {
  from: `"Megaphone" ${EMAIL}`,
  to: to,
  subject: subject,
  html: html
}
const transporter = nodemailer.createTransport(options);
transporter.sendMail(mail)
.then(info => console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)))
.catch(error => console.error(error))
