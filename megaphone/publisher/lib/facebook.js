'use strict'

const fs = require('fs')
const path = require('path')
const fbVideoUploader = require('facebook-api-video-upload');
const FB = require('fb')
const isVideo = require('is-video')
const replaceExt = require('replace-ext')

const content = require('lib/content')

exports.post = (payload, cb) => {
  const {message, file, profileId, accessToken} = payload

  FB.setAccessToken(accessToken)
  if(file) {
    content.download(file.bucket, file.key, 'facebook', (downloadFileError, downloadedFile) => {
      if(downloadFileError) {
        cb(downloadFileError, null, downloadedFile)
      } else {
        const mp4 = replaceExt(downloadedFile.path, '.mp4')
        const filePath = path.join(__dirname, '..', mp4)
        if(isVideo(filePath)) {
          fbVideoUploader({
            token: accessToken,
            id: profileId,
            stream: fs.createReadStream(filePath),
            description: message
          })
          .then(res => {
            cb(null, res, downloadedFile)
          })
          .catch(err => {
            const error = {
              statusCode: err.statusCode,
              statusMessage: err.error.error.message
            }
            cb(error, null, downloadedFile)
          })
        } else {
          const payload = {
            source: fs.createReadStream(filePath),
            caption: message
          }
          FB.api('me/photos', 'post', payload, (data) => {
            if(data.error || !data) {
              const error = {
                statusCode: data.error.code,
                statusMessage: data.error.message
              }
              cb(error, null, downloadedFile)
            } else if (!data) {
              cb('Data was empty', null, downloadedFile)
            } else {
              cb(null, data, downloadedFile)
            }
          })
        }
      }
    })
  } else {
    FB.api('me/feed', 'post', {message: message}, (data) => {
      if(data.error || !data) {
        const error = {
          statusCode: data.error.code,
          statusMessage: data.error.message
        }
        cb(error, null)
      } else if (!data) {
        cb('Data was empty', null)
      } else {
        cb(null, data)
      }
    })
  }
}
