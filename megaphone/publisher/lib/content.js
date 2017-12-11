'use strict'

const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg')
const request = require('request')
const aws = require('aws-sdk')

const s3 = new aws.S3()

exports.download = (bucket, key, provider, cb) => {
  s3.getObject({Bucket: bucket, Key: key}, (err, data) => {
    const prependedFilename = `${provider}-${key}`
    const file = fs.createWriteStream(prependedFilename)
    if(err) {
      console.error(err)
    } else {
      console.log(data.Body)
      file.write(data.Body, (fileCreateFailed, fileCreated) => {
        if(fileCreateFailed) {
          cb(fileCreateFailed, null)
        } else {
          cb(null, file)
        }
      })
    }
  })
}

exports.convert = (filePath) => {
  console.log(convert)
  ffmpeg(filePath)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .size('320x240')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      console.log('Processing finished !');
    })
    .save('/path/to/output.mp4');
}
