const expect = require('chai').expect
const User = require('models').User

describe('users', () => {

  before(() => {
    return User.sync({force: true})
  })

  after(() => {
    return User.destroy({truncate: true})
  })

  describe('models', () => {
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

  describe('controllers', () => {

  })
})
