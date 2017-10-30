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
    const uploadsPath = `${__dirname.replace('/controllers', '').replace('/models', '')}/${file.destination}${file.filename}`
    console.log(`Uploads path: ${uploadsPath}`)

    if (file.mimetype == 'video/mp4') {
      console.log(1)
      T.postMediaChunked({file_path: uploadsPath}, (err, data, res) => {
        var mediaIdStr = data.media_id_string
        var altText = "Small flowers in a planter on a sunny balcony, blossoming."
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        console.log(3)

        T.post('media/metadata/create', meta_params, function (err, data, response) {
          console.error(`Error: ${err}`)
          console.log(`Data: ${data}`)
          console.log(`Response: ${response}`)
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
            console.log(4)
            T.post('statuses/update', params, function (err, data, response) {
              console.log('Done')
            })
          }
        })
      })
    } else {
      console.log(2)
      fs.readFile(uploadsPath, (err, data) => {
        T.post('media/upload', {media_data: file}, (err, data, response) => {
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
      })

    }
  } else {
    console.log(3)
    T.post('statuses/update', {status: message}, (err, tweet, msg) => {
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
  Content.scheduleTwitterContent = (message, publishAt, accessTokenKey, accessTokenSecret, file) => {
    // console.log(`Message: ${message} | Publish At: ${publishAt} | Access Token Key: ${accessTokenKey} | Access Token Secret: ${accessTokenSecret}`)
    return Content.create({
      message: message,
      publishAt: publishAt,
      isTwitter: true
    })
    .then(content => {
      schedule.scheduleJob(content.publishAt, (err, info) => {
        postTwitter(message, accessTokenKey, accessTokenSecret, file)
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
