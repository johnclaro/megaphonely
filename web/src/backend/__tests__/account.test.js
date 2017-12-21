const expect = require('chai').expect
const request = require('supertest')

const server = require('server')
const Account = require('models').Account

const johndoe = {firstName: 'John', lastName: 'Doe', email: 'johndoe@outlook.com', password: 'johndoe'}
const foobar = {firstName: 'Foo', email: 'foobar@gmail.com', password: 'foobar'}


describe('accounts', () => {

  beforeEach(() => Account.sync({force: true}))

  it('POST /account create new account', () => {
    return request(server).post('/account').send(johndoe)
    .then(response => {
      let user = {
        firstName: johndoe.firstName,
        lastName: johndoe.lastName,
        email: johndoe.email,
        password: johndoe.password,
        id: 1,
        created_at: response.body.created_at,
        updated_at: response.body.updated_at
      }
      expect(user).to.deep.equal(response.body)
    })
  })

  it('POST /login valid credentials', () => {
    return request(server).post('/account').send(johndoe)
    .then(created => request(server).post('/login').send(johndoe).expect(200))
  })

  it('POST /login invalid credentials', () => {
    return request(server).post('/login').send(foobar).expect(401)
  })

  it('GET /settings with no token', () => {
    return request(server).get('/settings').expect(401)
  })

  it('GET /settings with valid token', () => {
    return request(server).post('/account').send(johndoe).expect(200)
    .then(account => request(server).post('/login').send(johndoe))
    .then(response => request(server).get('/settings').set('Authorization', response.body.token))
    .then(response => expect(response.body.message).to.equal('settings!'))
  })

  it('POST /account existing user', () => {
    return request(server).post('/account').send(johndoe)
    .then(account => request(server).post('/account').send(johndoe))
    .then(response => expect(response.body.message).to.equal('This email is already taken'))
  })

})
