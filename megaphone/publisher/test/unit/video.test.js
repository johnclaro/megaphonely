'use strict'

const path = require('path')
const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg')
const expect = require('chai').expect

const filePath = path.join(__dirname, '..', 'mp4')

describe('home', () => {
  after(() => {
    fs.unlink(mp4)
  })

  it('should convert mp4', (done) => {
    ffmpeg(file.path)
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(mp4);
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
