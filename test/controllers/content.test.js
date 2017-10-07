require('dotenv').config({path:'.env.test'})
const expect = require('chai').expect

describe('controllers/content', () => {
  it('should get something', () => {
    expect('moo').equal('moos')
  })
})
