const expect = require('chai').expect
const request = require('supertest')

const app = require('app.js')
const Account = require('models').Account

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
    it('POST /login valid user', () => {
      return request(app)
        .post('/login')
        .send({email: 'foobar@gmail.com', password: 'foobar'})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Successfully logged in')
    })

    describe('verificationToken', () => {
      it('GET /verifyverificationtoken valid verificationToken', () => {
        return Account.findOne({
          where: {email: 'validverificationtoken@gmail.com'}
        })
        .then(account => {
          return request(app)
            .get(`/verifyverificationtoken/${account.verificationToken}`)
            .expect('Location', '/dashboard')
            .expect('flash-message', 'Successfully verified account')
        })
      })

      it('GET /verifyverificationtoken invalid verificationToken', () => {
        return request(app)
          .get('/verifyverificationtoken/1')
          .expect(404)
      })
    })

    describe('passwordToken', () => {
      it('POST /forgot invalid email', () => {
        return request(app)
          .post('/forgot')
          .send({email: 'invalidemail'})
          .expect('flash-message', 'Email is not valid')
      })

      it('POST /forgot valid email', () => {
        return request(app)
          .post('/forgot')
          .send({email: 'foobar@gmail.com'})
          .expect('flash-message', 'If a Megaphone account exists for foobar@gmail.com, an e-mail will be sent with further instructions.')
      })

      it('POST /forgot email does not exist', () => {
        return request(app)
          .post('/forgot')
          .send({email: 'doesnotexist@gmail.com'})
          .expect('flash-message', 'If a Megaphone account exists for doesnotexist@gmail.com, an e-mail will be sent with further instructions.')
      })

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
          .expect('Location', '/dashboard')
          .expect('flash-message', 'Successfully updated password')
      })

      it('POST /resetpassword password too short', () => {
        return request(app)
          .post('/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA')
          .send({password: 'new'})
          .expect('Location', '/resetpassword/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHl3aW5sYW5uaXN0ZXJAZ21haWwuY29tIiwiaWF0IjoxNTA4NDIxOTYzfQ.4abFuti_qwiXAG5CdmCbMURE3Pg9_MnhAHEt_OjpHzA')
          .expect('flash-message', 'Password must contain at least 6 characters long')
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
          .expect('Location', '/dashboard')
          .expect('flash-message', 'Register successful')
      })

      it('POST /register invalid email', () => {
        return request(app)
          .post('/register')
          .send({email: '123'})
          .expect('Location', '/register')
          .expect('flash-message', 'Email is not valid')
      })

      it('POST /register first name empty', () => {
        return request(app)
          .post('/register')
          .send({email: 'foobar@gmail.com', password: 'foobar', firstName: ''})
          .expect('Location', '/register')
          .expect('flash-message', 'Please enter your first name')
      })

      it('POST /register first name too long', () => {
        return request(app)
          .post('/register')
          .send({
            email: 'riverrock@gmail.com',
            password: 'riverrock',
            firstName: Math.random().toString(5).substr(2, 101)
          })
          .expect('Location', '/register')
          .expect('flash-message', 'First name must be fewer than 100 characters')
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
          .expect('Location', '/register')
          .expect('flash-message', 'Last name must be fewer than 100 characters')
      })

      it('POST /register password too short', () => {
        return request(app)
          .post('/register')
          .send({email: 'foobar@gmail.com', firstName: 'foobar', password: '123'})
          .expect('Location', '/register')
          .expect('flash-message', 'Password must contain at least 6 characters long')
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
          .expect('Location', '/register')
          .expect('flash-message', 'This email is already taken')
      })
    })

    describe('auth', () => {
      const authUser = request.agent(app)

      it('POST /login invalid user', () => {
        return request(app)
          .post('/login')
          .send({email: 'invaliduser@gmail.com', password: 'invalidpassword'})
          .expect('Location', '/login')
          .expect('flash-message', 'Invalid email or password')
      })

      it('POST /login valid user', () => {
        return authUser
          .post('/login')
          .send({email: 'foobar@gmail.com', password: 'foobar'})
          .expect('Location', '/dashboard')
          .expect('flash-message', 'Successfully logged in')
      })

      it('GET /login auth user redirect to /dashboard', () => {
        return authUser
          .get('/login')
          .expect('Location', '/dashboard')
      })

      it('GET /register auth user redirect to /dashboard', () => {
        return authUser
          .get('/register')
          .expect('Location', '/dashboard')
      })

      it('GET /logout auth user', () => {
        return authUser
          .get('/logout')
          .expect('Location', '/login')
          .expect('flash-message', 'Successfully logged out')
      })

      it('GET /dashboard logged out user no access to /dashboard', () => {
        return authUser
          .get('/dashboard')
          .expect('Location', '/login')
      })
    })

    describe('settings', () => {
      const settingsUser = request.agent(app)

      it('GET /settings unauthenticated user', () => {
        return request(app)
          .get('/settings')
          .expect('Location', '/login')
          .expect('flash-message', 'Please sign in or register to access this page.')
      })

      it('POST /login valid user', () => {
        return settingsUser
          .post('/login')
          .send({email: 'foobar@gmail.com', password: 'foobar'})
          .expect('Location', '/dashboard')
          .expect('flash-message', 'Successfully logged in')
      })

      it('GET /settings authenticated user', () => {
        return settingsUser
          .get('/settings')
          .expect('Location', '/settings')
      })

      it('POST /sendverificationtoken', () => {
        return settingsUser
          .post('/sendverificationtoken')
          .expect('flashMessage', `Megaphone has sent a verification email to foobar@gmail.com. Check your inbox and click on the link in the email to verify your address. If you can't find it, check your spam folder or click the button to resend the email.`)
      })
    })
  })
})
