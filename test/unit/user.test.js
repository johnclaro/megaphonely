const expect = require('chai').expect
const User = require('models').User
const request = require('supertest')
const app = require('app.js')

describe('users', () => {

  before(() => {
    return User.sync({force: true}).then((msg) => {
      User.create({firstName: 'Jon', lastName: 'Snow', email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
    })
  })

  after(() => {
    return User.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a user', () => {
      return User.create({firstName: 'Little', lastName: 'Finger', email: 'littlefinger@gmail.com', password: 'ch40s15al4dd3r'})
        .then((user) => {expect(user).to.be.a('object')})
    })

    it('should get jonsnow@gmail.com for user with the 1 id', () => {
      return User.findById(1).then((user) => {
        expect(user.email).equal('jonsnow@gmail.com')
      })
    })

    it('should get a user object by supplying email and password', () => {
      return User.findUser('jonsnow@gmail.com', '1kn0wn0th1ng').then((user) => {
        expect(user.email).equal('jonsnow@gmail.com')
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

    it('should successfully login jonsnow@gmail.com', (done) => {
      request(app)
        .post('/signin')
        .send({email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
        .expect(302)
        .expect('Location', '/users/1')
        .end(done)
    })

    it('should redirect me to /login because email does not exist', (done) => {
      request(app)
        .post('/signin')
        .send({email: 'valarmorghulis@gmail.com', password: 'br4v0s'})
        .expect(302)
        .expect('Location', '/signin')
        .end(done)
    })

    it('should create a new user by sending a POST to /signup', (done) => {
      const user = {
        firstName: 'Khal',
        lastName: 'Drogo',
        email: 'khaldrogo@gmail.com',
        password: 'd0thr4k1'
      }

      request(app)
        .post('/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body.email).equal(user.email)
          expect(res.body.firstName).equal(user.firstName)
          expect(res.body.lastName).equal(user.lastName)
          done()
        })
    })
  })
})
