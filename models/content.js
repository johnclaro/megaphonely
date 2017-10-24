'use strict'

const schedule = require('node-schedule')
const parser = require('cron-parser')
const Twit = require('twit')

function postTwitter(content, message){
  var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  T.post('statuses/update', {status: message}, (err, tweet, msg) => {
    if (err) {
      console.error(err.message)
      return (err, null)
    }
    console.log('Successfully posted to twitter')
    content.update({isTwitterPublished: true})
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
      validate: {
        isDate: true
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
      var now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      console.log(`Scheduled: ${now}`)
      schedule.scheduleJob(now, (err, info) => {
        postTwitter(content, message)
      })
      return (null, `Scheduled to post: ${message}`)
    })
    .catch(err => {
      return (err, null)
    })
  }
  return Content
}
