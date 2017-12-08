const fs = require('fs')

const request = require('request')
const aws = require('aws-sdk')

const s3 = new aws.S3()

exports.download = (bucket, key, cb) => {
  s3.getObject({Bucket: bucket, Key: key}, (err, data) => {
    const file = fs.createWriteStream(key)
    if(err) {
      console.error(err)
    } else {
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
