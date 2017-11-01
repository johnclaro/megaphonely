'use strict'

const fs = require('fs')
const path = require('path')
var FB = require('fb')

exports.post = (accessToken, socialId, message, file, cb) => {
  FB.setAccessToken(accessToken)
  if(file) {
    const filePath = path.join(__dirname, '..', file.path)
    FB.api('me/photos', 'post', {source: fs.createReadStream(filePath), caption: 'My cappppption!'}, (data) => {
      if(data.error) cb(data.error, null)
      if(!data) cb('Data was empty', null)
      cb(data.post_id, null)
    })
  } else {
    FB.api('me/feed', 'post', {message: message}, (data) => {
      if(data.error) cb(data.error, null)
      if(!data) cb('Data was empty', null)
      cb(data.post_id, null)
    })
  }
}
