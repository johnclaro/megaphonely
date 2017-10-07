require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const User = require('../models/').User

describe('users', () => {

  beforeEach(function() {
    return User.sync()
  })

  afterEach(function() {
    return User.destroy({truncate: true})
  })

  it("should create a user", function() {
    return User.create({
      email: 'a@gmail.com',
      password: '1234567'
    })
      .then(function(user) {
        expect(user).to.be.a('object')
      })
  })
})
