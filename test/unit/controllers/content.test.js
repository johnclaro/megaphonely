require('dotenv').config({path:'.env.test'})
const request = require('supertest')
const app = require('app.js')
const expect = require('chai').expect

describe('POST /content/add', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/content/add')
      .send({message: 'test message'})
      .expect(200, done)
  })
})
