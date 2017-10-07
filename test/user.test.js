require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const db = require('../models/')

describe('users', () => {

  after(function() {
    db.sequelize.authenticate()
      .then(function(msg) {
        db.sequelize.close()
      })
  })

  beforeEach(function() {
    db.User.sync()
  })

  afterEach(function() {
    db.User.destroy({truncate: true})
  })

  it("should create user", function() {
    const newUser = {
      email: 'a@gmail.com',
      password: '1234567'
    }
    return db.User.create(newUser)
      .then(function(user) {
        expect(user).to.be.a('object')
      })
  })
})
