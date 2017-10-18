const expect = require('chai').expect
const Account = require('models').Account
const request = require('supertest')
const app = require('app.js')

describe('accounts', () => {

  before(() => {
    return Account.sync({force: true}).then((msg) => {
      Account.create({firstName: 'Jon', lastName: 'Snow', email: 'jonsnow@gmail.com', password: '1kn0wn0th1ng'})
      Account.create({firstName: 'Tyrion', lastName: 'Lannister', email: 'tyrionlannister@gmail.com', password: 'tr14lbyf1r3'})
      Account.create({firstName: 'Rob', lastName: 'Stark', email: 'robstark@gmail.com', password: 'r0bst4rk', passwordToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg'})
    })
  })

  after(() => {
    return Account.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create an account', () => {
      const newAccount = {
        firstName: 'Little',
        lastName: 'Finger',
        email: 'LITTLEFINGER@gmail.com',
        password: 'ch405154l4dd3r'
      }
      return Account.create(newAccount).then((account) => {
          expect(account.email).equal(newAccount.email.toLowerCase())
          expect(account.passwordHash).not.equal(newAccount.password)
        })
    })

    it('should get an account by ID', () => {
      return Account.findById(1).then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should get an account by email and password', () => {
      return Account.findAccount('jonsnow@gmail.com', '1kn0wn0th1ng').then((account) => {
        expect(account.email).equal('jonsnow@gmail.com')
      })
    })

    it('should generate a password token', () => {
      return Account.generatePasswordToken('jonsnow@gmail.com').then((token) => {
        expect(token).to.be.a('string')
      })
    })

    it('should decrypt a password token', () => {
      // This token does not have an expiry date !
      // This token should give back a value of
      //     { data: 'jonsnow@gmail.com', iat: 1507757856 }
      // once it is decrypted properly
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiam9uc25vd0BnbWFpbC5jb20iLCJpYXQiOjE1MDc3NTc4NTZ9.Fe_0-GE76jiDz1-atXBnq6qhkziRVUjChppTPvK8ZVw'
      return Account.verifyPasswordToken(token).then((decrypted) => {
        expect(decrypted.data).equal('jonsnow@gmail.com')
      })
    })
  })

  describe('controllers', () => {
    it('GET /login', (done) => {
      request(app)
        .get('/accounts/1')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    })

    it('POST /login', (done) => {
      request(app)
        .post('/login')
        .send({email: 'valarmorghulis@gmail.com', password: 'br4v0s'})
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    })

    it('POST /register', (done) => {
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

    it('POST /resetPassword', (done) => {
      request(app)
        .post('/forgot')
        .send({email: 'jonsnow@gmail.com'})
        .end((err, res, cb) => {
          request(app)
            .post(`/resetPassword?token=${res.text}`)
            .send({email: 'jonsnow@gmail.com'})
            .expect(200)
            .end(done)
        })
    })

    it('GET /resetPassword?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg', (done) => {
      request(app)
        .get('/resetPassword?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg')
        .end((err, res) => {
          expect(res.text).to.be.equal('Account exist with password token')
          done()
        })
    })
  })
})
