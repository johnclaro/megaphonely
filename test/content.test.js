require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const Content = require('../models/').Content

describe('contents', () => {

  beforeEach(() => {
    return Content.sync({force: true})
  })

  afterEach(() => {
    return Content.destroy({truncate: true})
  })

  it('should create a content', () => {
    return Content.create({
      message: 'test message'
    })
      .then((content) => {
        expect(content).to.be.a('object')
      })
  })

})
