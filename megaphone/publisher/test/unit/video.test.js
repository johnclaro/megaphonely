'use strict'

const path = require('path')
const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg')
const expect = require('chai').expect

const filePath = path.join(__dirname, '..', '.mp4')

describe('home', () => {
  after(() => {
    return Account.destroy({truncate: true})
  })

  it('should convert mp4', (done) => {
    done()
  })

  it('should convert mkv', (done) => {
    done()
  })

  it('should convert 3gp', (done) => {
    done()
  })

  it('should return 200 OK', (done) => {
    done()
  })

  it('should return 200 OK', (done) => {
    done()
  })

  it('should return 200 OK', (done) => {
    done()
  })

  it('should return 200 OK', (done) => {
    done()
  })
})
