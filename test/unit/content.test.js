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

})
