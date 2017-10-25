'use strict'

const schedule = require('node-schedule')
const Twit = require('twit')

function postTwitter(message){
  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  return T.post('statuses/update', {status: message}, (err, tweet, msg) => {
    if (err) {
      console.error(`Error tweet: ${err}`)
      return (err, null)
    }
    console.log(`Tweeted: ${message}`)
  })
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
    publishAt: {
      field: 'publish_at',
      type: Sequelize.DATE,
      set: function(publishAt) {
        if (publishAt) {
          var publishAt = new Date(publishAt)
        } else {
          var publishAt = new Date()
          publishAt.setMinutes(publishAt.getMinutes() + 1);
        }
        this.setDataValue('publishAt', publishAt)
      }
    },
    isTwitterPublished: {
      field: 'is_twitter_published',
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
  Content.schedule = (message, publishAt) => {
    return Content.create({
      message: message,
      publishAt: publishAt
    })
    .then(content => {
      schedule.scheduleJob(publishAt, (err, info) => {
        postTwitter(message)
        .then(success => {
          content.update({isTwitterPublished: true})
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
