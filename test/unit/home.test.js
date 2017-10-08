const request = require('supertest')
const app = require('app.js')
const expect = require('chai').expect


describe('home', () => {
  describe('controllers', () => {
    it('should return 200 OK', (done) => {
      request(app)
        .get('/')
        .expect(200, done)
    })
  })
})
