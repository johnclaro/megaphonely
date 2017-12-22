'use strict';

const jwt = require('jsonwebtoken');
const promisify = require('bluebird').promisify;
// exports.jwtSign = promisify(jwt.sign);

promisify(jwt.sign)({}, '213')
.then(success => console.log(success))
.catch(error => console.error(error))
