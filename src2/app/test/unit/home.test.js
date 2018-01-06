const request = require('supertest')
const expect = require('chai').expect

const app = require('app.js')

describe('home', () => {
  describe('controllers', () => {
    it('should return 200 OK', (done) => {
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
})
