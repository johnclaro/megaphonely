const expect = require('chai').expect
const request = require('supertest')

const server = require('server')
const Account = require('models').Account

describe('accounts', () => {

  beforeAll(() => {
    return Account.sync({force: true})
    .then(account => {
      Account.create({firstName: 'valid', lastName: 'verification token', email: 'validverificationtoken@gmail.com'})
    })
  })

  it('GET / all accounts', () => {
    return Account.findOne({
      where: {email: 'validverificationtoken@gmail.com'}
    })
    .then(account => {
      return request(server)
        .get('/')
        .expect(200)
    })
  })

})
