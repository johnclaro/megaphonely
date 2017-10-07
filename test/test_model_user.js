require('dotenv').config({path:'.env.test'})
var assert = require('assert')
var User = require('../models/').User

describe('User', function () {
  beforeEach((done) => {
    User.sync({force:true})
      .then(done())
      .catch(function(error) {
        done(error)
      })
  })

  it('should create a user', function(done) {
    User.create({email:'a@gmail.com', password:'1234567'})
      .then(done(null, 'mooo'))
      .catch(function(error) {
        done(error, null)
      })
  })
})
