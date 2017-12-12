'use strict'

const path = require('path')
const fs = require('fs')

const replaceExt = require('replace-ext')
const ffmpeg = require('fluent-ffmpeg')
const expect = require('chai').expect

describe('home', () => {
  after(() => {
    const filesToDelete = ['3gp', 'flv', 'mkv', 'mp4', 'ogv', 'webm']

    for (let i=0; i<filesToDelete.length; i++) {
      const fileToDelete = `${filesToDelete[i]}.mp4`
      try {
        fs.unlink(`${path.join(__dirname, '..', fileToDelete)}`)
      } catch(err) {
        console.error('Do nothing')
      }
    }
  })

  it('should convert mp4', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.mp4'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', 'mp4.mp4'));
  })

  it('should convert mkv', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.mkv'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', 'mkv.mp4'));
  })

  it('should convert 3gp', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.3gp'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', '3gp.mp4'));
  })

  it('should convert flv', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.flv'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', 'flv.mp4'));
  })

  it('should convert ogv', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.ogv'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', 'ogv.mp4'));
  })

  it('should convert webm', (done) => {
    ffmpeg(path.join(__dirname, '..', 'video.webm'))
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        done(err, null)
      })
      .on('end', function() {
        done()
      })
      .save(path.join(__dirname, '..', 'webm.mp4'));
  })
})
