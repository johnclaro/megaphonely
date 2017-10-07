require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect

describe('users', () => {
  var User = require('../models/').User

  beforeEach(function() {
    User.sync()
  })

  afterEach(function() {
    User.destroy({truncate: true})
  })

  it("should pass", function() {
    return User.create({email: 'a@gmail.com', password:'1234567'}).then(function(user) {
      expect(user.email).equal('moo')
    })
  })
})
