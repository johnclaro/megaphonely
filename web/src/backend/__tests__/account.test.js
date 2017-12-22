const expect = require('chai').expect;
const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const Account = require('../models').Account;

const johndoe = {firstName: 'John', lastName: 'Doe', email: 'rbxou4rilv2ifu7h@ethereal.email', password: 'johndoe'};
const foobar = {firstName: 'Foo', email: 'foobar@gmail.com', password: 'foobar'};


describe('accounts', () => {

  beforeEach(() => Account.sync({force: true}))

  it('POST /signup create new account', () => {
    return request(app).post('/signup').send(johndoe)
    .then(response => expect(johndoe).to.deep.equal(response.body))
  })

  it('POST /login valid credentials', () => {
    return request(app).post('/signup').send(johndoe)
    .then(created => request(app).post('/login').send(johndoe).expect(200))
  })

  it('POST /login account does not exist', () => {
    return request(app).post('/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(foobar).expect(401))
    .then(response => expect(response.body.message).to.equal('Invalid credentials'))
  })

  it('POST /login email exists but invalid password', () => {
    const invalid = {email: johndoe.email, password: '123456'}
    return request(app).post('/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(invalid).expect(401))
    .then(response => expect(response.body.message).to.equal('Invalid credentials'))
  })

  it('GET /settings with no token', () => {
    return request(app).get('/settings').expect(401)
  })

  it('GET /settings with valid token', () => {
    return request(app).post('/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/login').send(johndoe))
    .then(response => request(app).get('/settings').set('Authorization', response.body.token))
    .then(response => expect(response.body.message).to.equal('settings!'))
  })

  it('POST /signup existing user', () => {
    return request(app).post('/signup').send(johndoe)
    .then(account => request(app).post('/signup').send(johndoe))
    .then(response => expect(response.body.message).to.equal('This email is already taken'))
  })

  it('POST /signup invalid password', () => {
    let invalid = johndoe
    invalid.password = '1'
    return request(app).post('/signup').send(invalid)
    .then(response => expect(response.body.message).to.equal('Password must contain at least 6 characters long'))
  })

  it('POST /forgot_password send forgot password link to email that does not exist', () => {
    return request(app).post('/forgot_password').send(johndoe)
    .then(response => expect(response.body.message).to.equal('No email found in database'))
  })

  it.only('POST /forgot_password send forgot password link to email that exists', () => {
    return request(app).post('/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/forgot_password').send(johndoe))
    .then(response => console.log('Done test'))
    // .then(response => expect(response.body.message).to.equal('Email sent'))
  })
})
