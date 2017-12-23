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
const jwt = require('./middlewares/jwt');

app.get('/health', health.index);
app.post('/signup', account.signup);
app.post('/login', account.login);
app.post('/forgot', account.forgot);
app.get('/settings', jwt, account.settings);

app.use((req, res, next) => res.status(404));

app.use((error, req, res, next) => {
  const env = process.env.NODE_ENV;
  const message = env === 'production' ? 'Internal Server Error' : error;
  return res.status(500).send({message: message});
});

module.exports = app;
