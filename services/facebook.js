'use strict'

const fs = require('fs')
const path = require('path')
const fbVideoUploader = require('facebook-api-video-upload');
var FB = require('fb')

exports.post = (message, file, socialId, accessToken, cb) => {
  FB.setAccessToken(accessToken)
  if(file) {
    const filePath = path.join(__dirname, '..', file.path)

    if(file.mimetype == 'video/mp4') {
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
        if(data.error) cb(data.error, null)
        if(!data) cb('Data was empty', null)
        cb(null, data.post_id)
      })
    }
  } else {
    FB.api('me/feed', 'post', {message: message}, (data) => {
      if(data.error) cb(data.error, null)
      if(!data) cb('Data was empty', null)
      cb(null, data.post_id)
    })
  }
}
