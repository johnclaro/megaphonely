'use strict'

const schedule = require('node-schedule')
const Twit = require('twit')
const path = require('path')
const fs = require('fs')

function postTwitter(message, accessTokenKey, accessTokenSecret, file, cb) {
  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: accessTokenKey,
    access_token_secret: accessTokenSecret
  })

  if (file) {
    const filePath = path.join(__dirname, '..', file.path)
    if (file.mimetype == 'video/mp4') {
      T.postMediaChunked({file_path: filePath}, (err, data, res) => {
        if(err) console.error(err)
        var mediaIdStr = data.media_id_string
        var altText = message
        var metaParams = { media_id: mediaIdStr, alt_text: { text: altText } }
        T.post('/media/metadata/create', metaParams, (err, data, res) => {
          var params = { status: message, media_ids: [mediaIdStr] }
          T.post('statuses/update', params, (err, tweet, msg) => {
            if (err) {return (err, null)}
            cb(null, 'Done')
          })
        })
      })
    } else {
      fs.readFile(filePath, (err, data) => {
        T.post('media/upload', {media_data: data.toString('base64')}, (err, data, response) => {
          if(err) console.error(err)
          var mediaIdStr = data.media_id_string
          var altText = message
          var metaParams = { media_id: mediaIdStr, alt_text: { text: altText } }
          T.post('/media/metadata/create', metaParams, (err, data, res) => {
            var params = { status: message, media_ids: [mediaIdStr] }
            T.post('statuses/update', params, (err, tweet, msg) => {
              if (err) return (err, null)
              cb(null, 'Done')
            })
          })
        })
      })

    }
  } else {
    T.post('statuses/update', {status: message}, (err, tweet, msg) => {
      if (err) return (err, null)
      cb(null, 'Done')
    })
  }

}

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    accountId: {
      field: 'account_id',
      type: Sequelize.INTEGER,
    },
    message: Sequelize.STRING,
    isPublished: {
      field: 'is_published',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isTwitter: {
      field: 'is_twitter',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    publishAt: {
      field: 'publish_at',
      type: Sequelize.DATE
    },
    createdAt: {
      field: 'created_at',
      type: Sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE
    }
  }, {
    tableName: 'contents'
  })

  Content.associate = (models, cb) => {}
  Content.scheduleTwitterContent = (accountId, message, publishAt, accessTokenKey, accessTokenSecret, file) => {
    // console.log(`Message: ${message} | Publish At: ${publishAt} | Access Token Key: ${accessTokenKey} | Access Token Secret: ${accessTokenSecret}`)
    return Content.create({
      accountId: accountId,
      message: message,
      publishAt: publishAt,
      isTwitter: true
    })
    .then(content => {
      schedule.scheduleJob(content.publishAt, (err, info) => {
        postTwitter(message, accessTokenKey, accessTokenSecret, file, (err, data) => {
          if(err) return (err)
          content.update({isPublished: true})
        })
      })
      return (null, `Scheduled to post: ${message}`)
    })
    .catch(err => {
      console.error(err)
      return (err, null)
    })
  }
  return Content
}
