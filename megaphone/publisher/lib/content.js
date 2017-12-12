'use strict'

const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg')
const request = require('request')
const aws = require('aws-sdk')
const isVideo = require('is-video')
const replaceExt = require('replace-ext')
// const getDuration = require('get-video-duration')

const s3 = new aws.S3()

exports.download = (bucket, key, provider, cb) => {
  s3.getObject({Bucket: bucket, Key: key}, (err, data) => {
    const prependedFilename = `${provider}-${key}`
    const file = fs.createWriteStream(prependedFilename)
    if(err) {
      console.error(err)
    } else {
      file.write(data.Body, (fileCreateFailed, fileCreated) => {
        if(fileCreateFailed) {
          cb(fileCreateFailed, null)
        } else {
          if (isVideo(file.path)) {
            const mp4 = replaceExt(file.path, '.mp4')
            ffmpeg(file.path)
              .videoCodec('libx264')
              .audioCodec('libmp3lame')
              .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
                fs.unlink(file.path)
                fs.unlink(mp4)
                cb(err, null)
              })
              .on('end', function() {
                console.log('Processing finished !');
                cb(null, file)
              })
              .save(mp4);
          } else {
            cb(null, file)
          }
        }
      })
    }
  })
}
