const expect = require('chai').expect
const request = require('supertest')

const server = require('server')
const Account = require('models').Account

describe('accounts', () => {

  it('POST /login', () => {
    const user = {email: 'jkrclaro@outlook.com', password: 'postmalone'}
    return request(server).post('/login').send(user).expect(200)
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
