'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const JWT = require('express-jwt');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const upload = multer({ dest: 'uploads/' })
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

const health = require('./controllers/health');
const account = require('./controllers/account');
const content = require('./controllers/content');
const jwt = JWT({ secret: process.env.SECRET });
const jwtCookies = JWT({
  secret: process.env.SECRET,
  getToken: (req) => (req.cookies && req.cookies.jwt) ? req.cookies.jwt : null
})
const Passport = require('./middlewares/passport');

const secret = process.env.SECRET;
app.get('/health', health.index);
app.post('/signup', account.signup);
app.post('/login', account.login);
app.post('/forgot', account.forgot);
app.post('/reset', jwt, account.reset);
app.get('/settings', jwt, account.settings);
app.post('/content', jwt, upload.single('media'), content.create);

const redirect = {
  successRedirect: 'http://megaphone.dev:3000/dashboard',
  failureRedirect: 'http://megaphone.dev:3000/login',
  session: false
};
app.get('/auth/facebook', jwtCookies, passport.authenticate('facebook', {scope: ['public_profile', 'email', 'publish_actions']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', redirect));

app.use((req, res, next) => res.status(404));

app.use((error, req, res, next) => {
  let message;
  const code = error.status || 500;
  if (process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error'
  } else {
    console.error(error)
    message = error;
  }
  return res.status(code).send({ message });
});

module.exports = app;
