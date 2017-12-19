const expect = require('chai').expect
const request = require('supertest')

const server = require('server')
const Account = require('models').Account

describe('accounts', () => {

  beforeAll(() => {
    return Account.sync({force: true})
    .then(account => {
      Account.create({firstName: 'John', lastName: 'Claro', email: 'jkrclaro@outlook.com', password: 'postmalone'})
    })
  })

  it('POST /account/auth', () => {
    return request(server)
      .post('/account/authenticate')
      .send({email: 'jkrclaro@outlook.com', password: 'postmalone'})
      .expect(200)
      .then(res => {
        console.log(res.body.token)
      })
  })

})
