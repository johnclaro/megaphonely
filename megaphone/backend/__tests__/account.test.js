const expect = require('chai').expect
const request = require('supertest')

const server = require('server')
const Account = require('models').Account

describe('accounts', () => {

  beforeAll(() => {return Account.destroy({truncate: true})})

  it('POST /account create new account', () => {
    const user = {
      firstName: 'John', lastName: 'Doe', email: 'johndoe@outlook.com',
      password: 'johndoe'
    }
    return request(server).post('/account').send(user).expect(201)
  })

  it('POST /login valid credentials', () => {
    const user = {
      firstName: 'John', email: 'johndoe@gmail.com', password: 'johndoe'
    }
    return request(server).post('/login').send(user).expect(201)
  })

  it('POST /login invalid credentials', () => {
    const user = {
      firstName: 'Foo', email: 'foobar@gmail.com', password: 'foobar'
    }
    return request(server).post('/login').send(user).expect(401)
  })

  it('GET /settings with no token', () => {
    return request(server).get('/settings').expect(401)
  })

  it('GET /settings with valid token', () => {
    // This token had a secret of 'secret' (without quotes) and no expiration
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTEzNzIxOTAyfQ.wVpQ10weBXlSwLgFoaxxrO90Ezseo9laQkXvOng1PNY'
    return request(server).get('/settings').set('Authorization', token).expect(200)
  })

})
