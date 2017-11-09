'use strict'

const fs = require('fs')
const path = require('path')
const fbVideoUploader = require('facebook-api-video-upload');
const FB = require('fb')

exports.post = (message, file, socialId, accessToken, cb) => {
  FB.setAccessToken(accessToken)
  if(file) {
    const filePath = path.join(__dirname, '..', file.path)

    // TODO: Store this as a variable somewhere
    const videoFormats = [
      'mp4', '3g2', '3gpp', 'asf', 'dat', 'divx', 'dv', 'f4v', 'flv', 'gif',
      'm2ts', 'm4v', 'mkv', 'mod', 'mp4', 'mpe', 'mpeg', 'mpeg4', 'mpg',
      'mts', 'nsv', 'ogm', 'ogv', 'qt', 'tod', 'ts', 'vob', 'wmv',
    ]

    if(videoFormats.indexOf(file.filename.split('.')[1]) >= 0) {
      fbVideoUploader({
        token: accessToken,
        id: socialId,
        stream: fs.createReadStream(filePath),
        description: message
      })
      .then(res => {
        cb(null, res)
      })
      .catch(err => {
        cb(err, null)
      })
    } else {
      const payload = {source: fs.createReadStream(filePath), caption: message}
      FB.api('me/photos', 'post', payload, (data) => {
        if(data.error || !data) {
          cb(data.error, null)
        } else if (!data) {
          cb('Data was empty', null)
        } else {
          cb(null, data)
        }
      })
    }
  } else {
    FB.api('me/feed', 'post', {message: message}, (data) => {
      if(data.error || !data) {
        cb(data.error, null)
      } else if (!data) {
        cb('Data was empty', null)
      } else {
        cb(null, data)
      }
    })
  }
}
