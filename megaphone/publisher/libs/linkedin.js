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
      console.error(`ERRRRROR: ${JSON.stringify(err, null, 4)}`)
      const error = {
        statusCode: err.status,
        statusMessage: err.message
      }
      cb(error, null)
    } else {
      if (data.updateKey && data.updateUrl) {
        cb(null, data)
      } else {
        const error = {
          statusCode: data.status,
          statusMessage: data.message
        }
        cb(error, null)
      }
    }
  })
}
