require('dotenv').config({path:'.env.test'})
var assert = require('assert')
var db = require('../models/')

describe('User', function () {
  it('should create a user', function (done) {
    
    db.User.create('john@gmail.com', 'password');
    done();
  });
});
