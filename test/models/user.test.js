require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const User = require('models').User

describe('models/users', () => {

  beforeEach(() => {
    return User.sync({force: true})
  })

  afterEach(() => {
    return User.destroy({truncate: true})
  })

  it('should create a user', () => {
    return User.create({
      email: 'a@gmail.com',
      password: '1234567'
    })
      .then((user) => {
        expect(user).to.be.a('object')
      })
  })
})
