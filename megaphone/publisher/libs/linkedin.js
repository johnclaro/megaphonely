'use strict'

exports.post = (payload, cb) => {
  const {message, file, accessToken, clientId, clientSecret} = payload

  const LinkedIn = require('node-linkedin')(clientId, clientSecret)
  const linkedin = LinkedIn.init(accessToken)

  if (file) {
    var content = {
      comment: message,
      content: {
        'title': '',
        'submitted-url': `https://${process.env.CLOUDFRONT}/${file.key}`
      },
      visibility: {
        code: 'connections-only'
      }
    }
  } else {
    var content = {
      comment: message,
      visibility: {
        code: 'connections-only'
      }
    }
  }

  linkedin.people.share(content, (err, data) => {
    if (err) {
      cb(err, null)
    } else {
      if (data.updateKey && data.updateUrl) {
        cb(null, data)
      } else {
        cb(data, null)
      }
    }
  })
}
