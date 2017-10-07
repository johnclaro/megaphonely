require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect
const Content = require('../models/').Content

describe('contents', () => {

  before(function() {
    Content.sync()
  })

  afterEach(function() {
    Content.destroy({truncate: true})
  })

  it("should create content because message is not specified", function() {
    return Content.create({
      message: '123k12k3m1k23k12m3'
    })
      .then(function(content) {
        expect(content).to.be.a('object')
      })
  })
})
