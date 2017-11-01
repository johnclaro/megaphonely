'use strict'

const graph = require('fbgraph')

exports.post = (accessToken, socialId, message, cb) => {
  const wallPost = {message: message}
  graph.setAccessToken(accessToken)
  graph.post(`${socialId}/feed?access_token=${accessToken}`, wallPost, (err, res) => {
    if(err) cb(err, null)
    cb(null, res)
  })
}
