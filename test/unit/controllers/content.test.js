require('dotenv').config({path:'.env.test'})
const request = require('supertest')
const app = require('app.js')
const expect = require('chai').expect

describe('GET /content/add', () => {
  it('should return 200 OK', () => {
    request(app)
      .get('/')
      .expect(200, done)
  })
})
