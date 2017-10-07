require('dotenv').config({path:'.env.test'})
const request = require('supertest')
const app = require('app.js')
const expect = require('chai').expect
const Content = require('models').Content

describe('contents', () => {

  before(() => {
    return Content.sync({force: true})
  })

  after(() => {
    return Content.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a content', () => {
      return Content.create({
        message: 'test message'
      })
        .then((content) => {
          expect(content).to.be.a('object')
        })
    })
  })

  describe('controllers', () => {
    it('should return 200 OK', (done) => {
      request(app)
        .get('/contents')
        .expect(200, done)
    })

    it('should return 200 OK', (done) => {
      request(app)
        .post('/contents/add')
        .send({message: 'test message'})
        .expect(200, done)
    })
  })

})
