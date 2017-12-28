'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const jwt = require('express-jwt');

const upload = multer({ dest: 'uploads/' })
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

const health = require('./controllers/health');
const account = require('./controllers/account');
const content = require('./controllers/content');
const Passport = require('./middlewares/passport');

const secret = process.env.SECRET;
app.get('/api/health', health.index);
app.post('/api/signup', account.signup);
app.post('/api/login', account.login);
app.post('/api/forgot', account.forgot);
app.post('/api/reset', jwt, account.reset);
app.get('/api/settings', jwt({ secret }), account.settings);
app.post('/api/content', jwt, upload.single('media'), content.create);

const redirect = {
  successRedirect: '/success', failureRedirect: '/failed', session: false
};
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'publish_actions']}));
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
