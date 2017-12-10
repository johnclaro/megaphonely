'use strict'

const Twit = require('twit')
const path = require('path')
const fs = require('fs')

const s3 = require('lib/s3')

function mediaTweet (twit, message, mediaId, cb) {
  twit.post('/media/metadata/create', {media_id: mediaId}, (err, data, res) => {
    const payload = {status: message, media_ids: [mediaId]}
    twit.post('statuses/update', payload, (err, tweet, msg) => {
      if (err) {
        cb(err, null)
      } else {
        cb(null, msg)
      }
    })
  })
}

exports.post = (payload, cb) => {
  const {message, file, accessTokenKey, accessTokenSecret, consumerKey,
         consumerSecret} = payload

  const twit = new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessTokenKey,
    access_token_secret: accessTokenSecret
  })

  if(file) {
    s3.download(file.bucket, file.key, 'twitter', (downloadFileError, downloadedFile) => {
      if(downloadFileError) {
        const error = {
          statusCode: downloadFileError.statusCode,
          statusMessage: downloadFileError.message
        }
        cb(downloadFileError, null, downloadedFile)
      } else {
        const filePath = path.join(__dirname, '..', downloadedFile.path)
        if(file.mimetype == 'video/mp4') {
          twit.postMediaChunked({file_path: filePath}, (err, data, res) => {
            if(err) {
              const error = {
                statusCode: err.statusCode,
                statusMessage: err.message
              }
              cb(error, null, downloadedFile)
            } else {
              mediaTweet(twit, message, data.media_id_string, (err, data) => {
                if(err) {
                  const error = {
                    statusCode: err.statusCode,
                    statusMessage: err.message
                  }
                  cb(error, null, downloadedFile)
                } else {
                  cb(null, data, downloadedFile)
                }
              })
            }
          })
        } else {
          fs.readFile(filePath, (err, data) => {
            if(err) cb(err, null)
            const payload = {media_data: data.toString('base64')}
            twit.post('media/upload', payload, (err, data, response) => {
              if(err) {
                const error = {
                  statusCode: err.statusCode,
                  statusMessage: err.message
                }
                cb(error, null, downloadedFile)
              } else {
                mediaTweet(twit, message, data.media_id_string, (err, data) => {
                  if(err) {
                    const error = {
                      statusCode: err.statusCode,
                      statusMessage: err.message
                    }
                    cb(error, null, downloadedFile)
                  } else {
                    cb(null, data, downloadedFile)
                  }
                })
              }
            })
          })
        }
      }
    })
  } else {
    twit.post('statuses/update', {status: message}, (err, tweet, msg) => {
      if (err) {
        const error = {
          statusCode: err.statusCode,
          statusMessage: err.message
        }
        cb(error, null)
      } else {
        cb(null, msg)
      }
    })
  }
}
