'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const health = require('./controllers/health');
const account = require('./controllers/account');
const content = require('./controllers/content');
const jwt = require('./middlewares/jwt');

app.get('/health', health.index);
app.post('/signup', account.signup);
app.post('/login', account.login);
app.post('/forgot', account.forgot);
app.post('/reset', jwt, account.reset);
app.post('/content', jwt, content.create);
app.get('/settings', jwt, account.settings);

app.use((req, res, next) => res.status(404));

app.use((error, req, res, next) => {
  let message;
  if (process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error'
  } else {
    console.error(error)
    message = error;
  }
  return res.status(500).send({ message });
});

module.exports = app;
