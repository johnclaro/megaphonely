'use strict'

const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const Content = require('models').Content
const Social = require('models').Social
const twitterService = require('services/twitter/service')
const facebookService = require('services/facebook/service')

exports.postContent = (req, res, next) => {
  const file = req.file || {}
  const filename = file.filename || ''
  const fileformat = filename.split('.').pop() || ''

  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('socialIds', 'You must choose a social account').notEmpty()
  req.assert('publishAt', 'You must specify a scheduling date').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  if(filename) {
    const message = `File is not valid. Please visit our FAQs for more info`
    req.checkBody('media', message).isValidFile(fileformat)
  }

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.socialIds == 'string') {
    req.body.socialIds = [req.body.socialIds]
  }

  if (req.body.publishAt == 'Today') {
    let publishAt = new Date()
    publishAt.setSeconds(publishAt.getSeconds() + 1);
    req.body.publishAt = publishAt.toISOString()
  } else {
    let publishAt = new Date(req.body.publishAt)
    publishAt.toISOString()
    req.body.publishAt = publishAt
  }

  const message = req.body.message
  const socialIds = req.body.socialIds
  const publishAt = req.body.publishAt

  const videoFormats = [
    'mp4', '3g2', '3gpp', 'asf', 'dat', 'divx', 'dv', 'f4v', 'flv', 'gif',
    'm2ts', 'm4v', 'mkv', 'mod', 'mp4', 'mpe', 'mpeg', 'mpeg4', 'mpg',
    'mts', 'nsv', 'ogm', 'ogv', 'qt', 'tod', 'ts', 'vob', 'wmv'
  ]
  const isVideo = videoFormats.indexOf(fileformat) >= 0 ? true : false

  Content.create({
    message: message,
    publishAt: publishAt,
    filename: filename,
    fileformat: fileformat,
    isVideo: isVideo,
  })
  .then(content => {
    Social.findAll({
      where: {socialId: socialIds, accountId: req.user.id, isConnected: true}
    })
    .then(socials => {
      for(let i=0; i<socials.length; i++) {
        let social = socials[i]
        social.addContent(content)
        if(social.provider == 'twitter') {
          const payload = {
            message: message,
            file: req.file,
            accessTokenKey: social.accessTokenKey,
            accessTokenSecret: social.accessTokenSecret,
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            socialId: social.id,
            contentId: content.id
          }

          const job = queue.create('twitter', payload).save((err) => {
            if(!err) {
              console.log('Created new twitter job:', job.id)
            } else {
              console.error('Error creating twitter job:', err)
            }
          })
        } else if (social.provider == 'facebook') {
          const payload = {
            message: message,
            file: req.file,
            socialId: social.socialId,
            accessToken: social.accessTokenKey,
            socialId: social.id,
            contentId: content.id
          }

          const job = queue.create('facebook', payload).save(err => {
            if(!err) {
              console.log('Created new facebook job:', job.id)
            } else {
              console.error('Error creating facebook job:', err)
            }
          })
        } else {
          console.log(`'${social.provider}' provider not yet implemented`)
        }
      }
    })
  })

  const flashMessage = `Succesfully scheduled content`
  req.flash('success', flashMessage)
  res.header('flash-message', flashMessage)
  return res.redirect('/dashboard')
}
