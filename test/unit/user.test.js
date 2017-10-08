const expect = require('chai').expect
const User = require('models').User
const request = require('supertest')
const app = require('app.js')

describe('users', () => {

  before(() => {
    return User.sync({force: true}).then((msg) => {
      return User.create({email: 'first@gmail.com', password: '1234567'})
    })
  })

  after(() => {
    console.log('Destroyingg..')
    return User.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a user', () => {
      return User.create({email: 'second@gmail.com', password: '1234567'})
        .then((user) => {expect(user).to.be.a('object')})
    })

    it('should get first@gmail.com for user with the 1 id', () => {
      return User.findById(1).then((user) => {
        expect(user.email).equal('first@gmail.com')
      })
    })
  })

  describe('controllers', () => {
    it('should redirect me to /login because i am not logged in', (done) => {
      request(app)
        .get('/users/1')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    })

    it('should get all the users', (done) => {
      request(app)
        .get('/users')
        .expect(200, done)
    })
  })
})
