const Twit = require('twit')
const path = require('path')
const fs = require('fs')

function mediaTweet (twit, message, mediaId, cb) {
  twit.post('/media/metadata/create', {media_id: mediaId}, (err, data, res) => {
    const payload = {status: message, media_ids: [mediaId]}
    twit.post('statuses/update', payload, (err, tweet, msg) => {
      if (err) cb(err, null)
      cb(null, tweet)
    })
  })
}

exports.post = (message, file, accessTokenKey, accessTokenSecret, cb) => {
  const twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: accessTokenKey,
    access_token_secret: accessTokenSecret
  })

  if(file) {
    const filePath = path.join(__dirname, '..', file.path)
    if(file.mimetype == 'video/mp4') {
      twit.postMediaChunked({file_path: filePath}, (err, data, res) => {
        if(err) cb(err, null)
        mediaTweet(twit, message, data.media_id_string, (err, data) => {
          if(err) cb(err, null)
          cb(null, `Finished tweeting video: ${data}`)
        })
      })
    } else {
      fs.readFile(filePath, (err, data) => {
        if(err) cb(err, null)
        const payload = {media_data: data.toString('base64')}
        twit.post('media/upload', payload, (err, data, response) => {
          if(err) cb(err, null)
          mediaTweet(twit, message, data.media_id_string, (err, data) => {
            if(err) cb(err, null)
            cb(null, `Finished tweeting picture: ${data}`)
          })
        })
      })
    }
  } else {
    twit.post('statuses/update', {status: message}, (err, tweet, msg) => {
      if (err) cb(err, null)
      cb(null, tweet)
    })
  }
}
