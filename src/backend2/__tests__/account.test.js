'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const Account = require('../models').Account;

const johndoe = {firstName: 'John', lastName: 'Doe', email: 'rbxou4rilv2ifu7h@ethereal.email', password: 'johndoe'};
const foobar = {firstName: 'Foo', email: 'foobar@gmail.com', password: 'foobar'};


describe('accounts', () => {

  beforeEach(() => Account.sync({force: true}))

  it('POST /api/signup', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(res => expect(johndoe).to.deep.equal(res.body))
  })

  it('POST /api/signup email already exists', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/api/signup').send(johndoe).expect(400))
    .then(res => expect(res.body).to.deep.equal({email: 'This email is already taken'}))
  })

  it('POST /api/signup invalid first name', () => {
    const invalid = {firstName: '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789', email: 'foobar@gmail.com', password: '12'}
    return request(app).post('/api/signup').send(invalid).expect(400)
    .then(res => expect(res.body).to.deep.equal({firstName: 'First name must be fewer than 100 characters'}))
  })

  it('POST /api/login', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(created => request(app).post('/api/login').send(johndoe).expect(200))
  })

  it('POST /api/login account does not exist', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/api/login').send(foobar).expect(401))
  })

  it('POST /api/login email exists but invalid password', () => {
    const invalid = {email: johndoe.email, password: '123456'}
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/api/login').send(invalid).expect(401))
  })

  it('POST /api/forgot', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/api/forgot').send(johndoe).expect(200))
  })

  it('POST /api/forgot forgot link to email that does not exist', () => {
    return request(app).post('/api/forgot').send(johndoe).expect(200)
  })

  it('GET /api/settings', () => {
    return request(app).post('/api/signup').send(johndoe).expect(200)
    .then(account => request(app).post('/api/login').send(johndoe).expect(200))
    .then(res => request(app).get('/api/settings').set('Authorization', `Bearer ${res.body.token}`).expect(200))
    .then(res => expect(res.body.message).to.equal('settings!'))
  })

  it('GET /api/settings with no token', () => {
    return request(app).get('/api/settings').expect(401)
  })
})
