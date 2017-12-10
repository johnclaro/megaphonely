'use strict'

const fs = require('fs')
const path = require('path')
const fbVideoUploader = require('facebook-api-video-upload');
const FB = require('fb')

const s3 = require('lib/s3')

exports.post = (payload, cb) => {
  const {message, file, profileId, accessToken} = payload

  FB.setAccessToken(accessToken)
  if(file) {
    // TODO: Store this as a variable somewhere
    const videoFormats = [
      'mp4', '3g2', '3gpp', 'asf', 'dat', 'divx', 'dv', 'f4v', 'flv', 'gif',
      'm2ts', 'm4v', 'mkv', 'mod', 'mp4', 'mpe', 'mpeg', 'mpeg4', 'mpg',
      'mts', 'nsv', 'ogm', 'ogv', 'qt', 'tod', 'ts', 'vob', 'wmv',
    ]
    s3.download(file.bucket, file.key, 'facebook', (downloadFileError, downloadedFile) => {
      if(downloadFileError) {
        cb(downloadFileError, null, downloadedFile)
      } else {
        const filePath = path.join(__dirname, '..', downloadedFile.path)
        if(videoFormats.indexOf(downloadedFile.path.split('.').pop()) >= 0) {
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
