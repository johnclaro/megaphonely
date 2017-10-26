const request = require('supertest')
const expect = require('chai').expect
const nock = require('nock')

const app = require('app.js')
const Content = require('models').Content

describe('contents', () => {

  afterEach(() => {
    return Content.destroy({truncate: true})
  })

  describe('controllers', () => {
    it('POST /content valid content', () => {
      app.request.isAuthenticated = () => {return true}

      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);

      return request(app)
        .post('/content')
        .send({message: 'foo', publishAt: publishAt, twitterIds: '123'})
        .expect('Location', '/dashboard?flash=Success')
    })

    it('POST /content invalid message', () => {
      app.request.isAuthenticated = () => {return true}
      return request(app)
        .post('/content')
        .send({message: ''})
        .expect('Location', '/dashboard?flash=Message%20cannot%20be%20empty')
    })

    it('POST /content no twitter account', () => {
      app.request.isAuthenticated = () => {return true}
      return request(app)
        .post('/content')
        .send({message: 'foo'})
        .expect('Location', '/dashboard?flash=You%20must%20choose%20a%20twitter%20account')
    })

    it('POST /content invalid publishAt', () => {
      app.request.isAuthenticated = () => {return true}
      return request(app)
        .post('/content')
        .send({message: 'foo', publishAt: '2016-10-10T12:12'})
        .expect('Location', '/dashboard?flash=Cannot%20schedule%20in%20the%20past')
    })
  })

})
