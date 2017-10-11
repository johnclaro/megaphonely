const expect = require('chai').expect
const Account = require('models').Account
const request = require('supertest')
const app = require('app.js')

describe('accounts', () => {

  before(() => {
    return Account.sync({force: true}).then((msg) => {
      Account.create({firstName: 'Jon', lastName: 'Snow', email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
      Account.create({firstName: 'Tyrion', lastName: 'Lannister', email: 'tyrionlannister@gmail.com', password: 'tr14lbyf1r3'})
    })
  })

  after(() => {
    return Account.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create an account with lowercased email and encrypted password', () => {
      const newAccount = {
        firstName: 'Little',
        lastName: 'Finger',
        email: 'LITTLEFINGER@gmail.com',
        password: 'ch405154l4dd3r'
      }
      return Account.create(newAccount)
        .then((account) => {
          expect(account.email).equal(newAccount.email.toLowerCase())
          expect(account.passwordHash).not.equal(newAccount.password)
        })
    })

    it('should get jonsnow@gmail.com for account with the 1 id', () => {
      return Account.findById(1).then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should get an account object by supplying email and password', () => {
      return Account.findAccount('jonsnow@gmail.com', '1kn0wn0th1ng').then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should match supplied email with decrypted email', () => {
      return Account.generatePasswordToken('jonsnow@gmail.com').then((token) => {
        return Account.verifyPasswordToken(token).then((verified) => {
          expect(verified.email).equal('jonsnow@gmail.com')
        }).catch((err) => {
          return (err, null)
        })
      })
    })
  })

  describe('controllers', () => {
    it('should redirect me to /login because i am not logged in', (done) => {
      request(app)
        .get('/accounts/1')
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

    it('should create a new account by sending a POST to /register', (done) => {
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

    it('POST /resetPassword should give me back a token', (done) => {
      request(app)
        .post('/resetPassword')
        .send({email: 'jonsnow@gmail.com'})
        .expect(200)
        .end(done)
    })
  })
})
