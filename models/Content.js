'use strict'

const schedule = require('node-schedule')
const Twit = require('twit')

function postTwitter(message, accessTokenKey, accessTokenSecret, file) {
  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: accessTokenKey,
    access_token_secret: accessTokenSecret
  })

  if (file) {
    return T.post('media/upload', {media_data: file}, (err, data, response) => {
      if(err) console.error(err)
      var mediaIdStr = data.media_id_string
      var altText = message
      var metaParams = { media_id: mediaIdStr, alt_text: { text: altText } }
      T.post('/media/metadata/create', metaParams, (err, data, res) => {
        var params = { status: message, media_ids: [mediaIdStr] }
        T.post('statuses/update', params, (err, tweet, msg) => {
          if (err) {
            console.error(`Error tweet: ${err}`)
            return (err, null)
          }
          console.log(`Tweeted: ${message}`)
        })
      })
    })
  } else {
    return T.post('statuses/update', {status: message}, (err, tweet, msg) => {
      if (err) {
        console.error(`Error tweet: ${err}`)
        return (err, null)
      }
      console.log(`Tweeted: ${message}`)
    })
  }

}

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    message: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Message is required'},
      }
    },
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
      type: Sequelize.DATE,
      set: function(publishAt) {
        if (publishAt) {
          var publishAt = new Date(publishAt)
        } else {
          var publishAt = new Date()
          publishAt.setSeconds(publishAt.getSeconds() + 1);
        }
        this.setDataValue('publishAt', publishAt)
      }
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
  Content.scheduleTwitterContent = (message, publishAt, accessTokenKey, accessTokenSecret, file) => {
    console.log(`Message: ${message} | Publish At: ${publishAt} | Access Token Key: ${accessTokenKey} | Access Token Secret: ${accessTokenSecret}`)
    return Content.create({
      message: message,
      publishAt: publishAt,
      isTwitter: true
    })
    .then(content => {
      schedule.scheduleJob(content.publishAt, (err, info) => {
        postTwitter(message, accessTokenKey, accessTokenSecret, file)
        .then(success => {
          content.update({isPublished: true})
        })
      })
      return (null, `Scheduled to post: ${message}`)
    })
    .catch(err => {
      return (err, null)
    })
  }
  return Content
}
