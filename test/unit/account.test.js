const expect = require('chai').expect
const request = require('supertest')

const app = require('app.js')
const Account = require('models').Account

const agent = request.agent(app)

describe('accounts', () => {

  before(() => {
    return Account.sync({force: true})
    .then(account => {
      // verificationToken
      Account.create({firstName: 'valid', lastName: 'verification token', email: 'validverificationtoken@gmail.com'})

      // passwordToken
      Account.create({firstName: 'valid', lastName: 'password token', email: 'validpasswordtoken@gmail.com', password: 'r0bst4rk', passwordToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg'})

      // register
      Account.create({firstName: 'foo', lastName: 'bar', email: 'foobar@gmail.com', password: 'foobar'})
    })
  })

  after(() => {
    return Account.destroy({truncate: true})
  })

  describe('controllers', () => {

    describe('verificationToken', () => {
      it('GET /verifyverificationtoken valid verificationToken', () => {
        return Account.findOne({
          where: {email: 'validverificationtoken@gmail.com'}
        })
        .then(account => {
          return request(app)
            .get(`/verifyverificationtoken/${account.verificationToken}`)
            .expect('Location', '/dashboard?flash=Successfully%20verified%20account')
        })
      })

      it('GET /verifyverificationtoken invalid verificationToken', () => {
        return request(app)
          .get('/verifyverificationtoken/1')
          .expect(404)
      })
    })

    describe('passwordToken', () => {
      it('GET /verifypasswordtoken valid passwordToken', () => {
        return request(app)
          .get('/verifypasswordtoken/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg')
          .expect('Location', '/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg')
      })

      it('GET /verifypasswordtoken invalid passwordToken', () => {
        return request(app)
          .get('/verifypasswordtoken/1')
          .expect(404)
      })

      it('POST /resetpassword valid password token', () => {
        return request(app)
          .post('/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicm9ic3RhcmtAZ21haWwuY29tIiwiaWF0IjoxNTA4MzUyNzIzfQ.70qzzfFCIhbfAt8Gy4t9kOQCngbolnXEzFUIvdNiLPg')
          .send({password: 'newpassword'})
          .expect('Location', '/dashboard?Successfully%20updated%20password')
      })

      it('POST /resetpassword password too short', () => {
        return request(app)
          .post('/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA')
          .send({password: 'new'})
          .expect('Location', '/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA?flash=Password%20must%20contain%20at%20least%206%20characters%20long')
      })
    })

    describe('register', () => {
      it('POST /register valid user', () => {
        return request(app)
          .post('/register')
          .send({
            firstName: 'john bar',
            email: 'johndoe@gmail.com',
            password: 'johndoe'
          })
          .expect('Location', '/dashboard?flash=Register%20successful')
      })

      it('POST /register invalid email', () => {
        return request(app)
          .post('/register')
          .send({email: '123'})
          .expect('Location', '/dashboard?flash=Email%20is%20not%20valid')
      })

      it('POST /register first name empty', () => {
        return request(app)
          .post('/register')
          .send({email: 'foobar@gmail.com', password: 'foobar', firstName: ''})
          .expect('Location', '/dashboard?flash=Please%20enter%20your%20first%20name')
      })

      it('POST /register first name too long', () => {
        return request(app)
          .post('/register')
          .send({
            email: 'riverrock@gmail.com',
            password: 'riverrock',
            firstName: Math.random().toString(5).substr(2, 101)
          })
          .expect('Location', '/dashboard?flash=First%20name%20must%20be%20fewer%20than%20100%20characters')
      })

      it('POST /register last name too long', () => {
        return request(app)
          .post('/register')
          .send({
            email: 'riverrock@gmail.com',
            password: 'riverrock',
            firstName: Math.random().toString(5).substr(2, 100),
            lastName: Math.random().toString(5).substr(2, 101)
          })
          .expect('Location', '/dashboard?flash=Last%20name%20must%20be%20fewer%20than%20100%20characters')
      })

      it('POST /register password too short', () => {
        return request(app)
          .post('/register')
          .send({email: 'foobar@gmail.com', firstName: 'foobar', password: '123'})
          .expect('Location', '/dashboard?flash=Password%20must%20contain%20at%20least%206%20characters%20long')
      })

      it('POST /register email already taken', () => {
        return request(app)
          .post('/register')
          .send({
            email: 'foobar@gmail.com',
            password: 'foobar',
            firstName: 'foo',
            lastName: 'bar'
          })
          .expect('Location', '/dashboard?flash=This%20email%20is%20already%20taken')
      })
    })

    // it('POST /login agent', () => {
    //   return agent
    //     .post('/login')
    //     .send({email: 'foobar@gmail.com', password: 'foobar'})
    //     .expect(302)
    //     .expect('Location', '/dashboard')
    // })
  })
})
