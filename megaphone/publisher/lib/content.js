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
    if (err) {
      cb(err, null)
    } else {
      let filename = `${provider}-${key}`
      const file = fs.createWriteStream(filename)
      file.write(data.Body, (err) => {
        if(err) {
          cb(err, null)
        } else {
          if (isVideo(file.path)) {
            const mp4 = replaceExt(file.path, '.mp4')
            ffmpeg(file.path)
              .videoCodec('libx264')
              .audioCodec('libmp3lame')
              .on('error', (err) => {
                cb(err, null)
              })
              .on('end', () => {
                cb(null, file.path)
              })
              .save(mp4);
          } else {
            cb(null, file.path)
          }
        }
      })
    }
  })
}
