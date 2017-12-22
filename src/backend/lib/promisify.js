'use strict';

const jwt = require('jsonwebtoken');
const promisify = require('bluebird').promisify;

module.exports = {
  jwtSign: promisify(jwt.sign)
}
