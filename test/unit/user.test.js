const expect = require('chai').expect
const User = require('models').User
const request = require('supertest')
const app = require('app.js')

describe('users', () => {

  before(() => {
    return User.sync({force: true}).then((msg) => {
      User.create({firstName: 'Jon', lastName: 'Snow', email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
      User.create({firstName: 'Tyrion', lastName: 'Lannister', email: 'tyrionlannister@gmail.com', password: 'tr14lbyf1r3'})
    })
  })

  after(() => {
    return User.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a user with lowercased email and encrypted password', () => {
      const newUser = {
        firstName: 'Little',
        lastName: 'Finger',
        email: 'LITTLEFINGER@gmail.com',
        password: 'ch405154l4dd3r'
      }
      return User.create(newUser)
        .then((user) => {
          expect(user.email).equal(newUser.email.toLowerCase())
          expect(user.passwordHash).not.equal(newUser.password)
        })
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
        .post('/login')
        .send({email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
        .expect(302)
        .end(done)
    })

    it('should redirect me to /login because email does not exist', (done) => {
      request(app)
        .post('/login')
        .send({email: 'valarmorghulis@gmail.com', password: 'br4v0s'})
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    })

    it('should create a new user by sending a POST to /register', (done) => {
      request(app)
        .post('/register')
        .send({
          firstName: 'Khal',
          lastName: 'Drogo',
          email: 'khaldrogo@gmail.com',
          password: 'd0thr4k1'
        })
        .expect(302)
        .end(done)
    })

    it('should give back a token', (done) => {
      request(app)
        .post('/forgot')
        .send({email: 'tyrionlannister@gmail.com'})
        .expect('dummy')
        .end(done)
    })
  })
})
