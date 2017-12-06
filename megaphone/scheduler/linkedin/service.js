'use strict'

const s3 = require('libs/s3')

exports.post = (payload, cb) => {
  const {message, file, accessToken, clientId, clientSecret} = payload

  const LinkedIn = require('node-linkedin')(clientId, clientSecret)
  const linkedin = LinkedIn.init(accessToken)

  const content = {
    comment: message,
    visibility: {
      code: "anyone"
    }
  }

  linkedin.people.share(content, (err, data) => {
    if (err) {
      cb(err, null)
    } else {
      cb(null, data)
    }
  })
}
