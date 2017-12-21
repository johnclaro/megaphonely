const expect = require('chai').expect;
const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const Account = require('../models').Account;

const johndoe = {firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe'};
const foobar = {firstName: 'Foo', email: 'foobar@gmail.com', password: 'foobar'};


describe('accounts', () => {

  beforeEach(() => Account.sync({force: true}))

  it('POST /account create new account', () => {
    return request(app).post('/account').send(johndoe)
    .then(response => expect(johndoe).to.deep.equal(response.body))
  })

  it('POST /login valid credentials', () => {
    return request(app).post('/account').send(johndoe)
    .then(created => request(app).post('/login').send(johndoe).expect(200))
  })

  it('POST /login account does not exist', () => {
    return request(app).post('/account').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(foobar).expect(401))
    .then(response => expect(response.body.message).to.equal('Invalid credentials'))
  })

  it('POST /login email exists but invalid password', () => {
    const invalid = {email: johndoe.email, password: '123456'}
    return request(app).post('/account').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(invalid).expect(401))
    .then(response => expect(response.body.message).to.equal('Invalid credentials'))
  })

  it('GET /settings with no token', () => {
    return request(app).get('/settings').expect(401)
  })

  it('GET /settings with valid token', () => {
    return request(app).post('/account').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(johndoe))
    .then(response => request(app).get('/settings').set('Authorization', response.body.token))
    .then(response => expect(response.body.message).to.equal('settings!'))
  })

  it('POST /account existing user', () => {
    return request(app).post('/account').send(johndoe)
    .then(account => request(app).post('/account').send(johndoe))
    .then(response => expect(response.body.message).to.equal('This email is already taken'))
  })

  it('POST /account invalid password', () => {
    let invalid = johndoe
    invalid.password = '1'
    return request(app).post('/account').send(invalid)
    .then(response => expect(response.body.message).to.equal('Password must contain at least 6 characters long'))
  })

})
