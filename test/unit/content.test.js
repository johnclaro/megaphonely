const request = require('supertest')
const expect = require('chai').expect

const app = require('app.js')
const Content = require('models').Content

describe('contents', () => {

  before(() => {
    return Content.sync({force: true}, () => {
      Content.create({message: 'test1'})
    })
  })

  after(() => {
    return Content.destroy({truncate: true})
  })

  describe('models', () => {
    it('should create a content', () => {
      return Content.create({message: 'test message', publishAt: new Date()})
        .then((content) => {
          expect(content).to.be.a('object')
        })
    })
  })

  describe('controllers', () => {
    it('POST /content valid content', () => {
      app.request.isAuthenticated = () => {return true}

      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);

      return request(app)
        .post('/content')
        .send({message: '123', publishAt: publishAt})
        .expect('Location', '/dashboard?content=Success')
    })

    it('POST /content invalid message', () => {
      app.request.isAuthenticated = () => {return true}
      return request(app)
        .post('/content')
        .send({message: ''})
        .expect('Location', '/dashboard?content=Message%20cannot%20be%20empty')
    })

    it('POST /content invalid publishAt', () => {
      app.request.isAuthenticated = () => {return true}
      return request(app)
        .post('/content')
        .send({message: 'test', publishAt: '2016-10-10T12:12'})
        .expect('Location', '/dashboard?content=Cannot%20schedule%20in%20the%20past')
    })
  })

})
