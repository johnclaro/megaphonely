require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const Content = require('../models/').Content

describe('contents', function() {

  beforeEach(function() {
    return Content.sync({force: true})
  })

  afterEach(function() {
    return Content.destroy({truncate: true})
  })

  it("should create a content", function() {
    return Content.create({
      message: ''
    })
      .then(function(content) {
        expect(content).to.be.a('object')
      })
      .catch(function(err) {
        throw new Error('')
      })
  })

})
