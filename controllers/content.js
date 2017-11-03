'use strict'

const nodeSchedule = require('node-schedule')

const Content = require('models').Content
const Social = require('models').Social
const Schedule = require('models').Schedule
const twitterService = require('services/twitter')
const facebookService = require('services/facebook')

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('socialIds', 'You must choose a social account').notEmpty()
  req.assert('publishAt', 'You must specify a scheduling date').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.socialIds == 'string') req.body.socialIds = [req.body.socialIds]

  if (req.body.publishAt == 'Today') {
      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);
  } else {
    var publishAt = new Date(req.body.publishAt)
  }
  var publishAt = publishAt.toISOString()

  Content.create({
    message: req.body.message,
    publishAt: publishAt
  })
  .then(content => {
    Social.findAll({
      where: {socialId: req.body.socialIds, isConnected: true}
    })
    .then(socials => {
      for(let i=0; i<socials.length; i++) {
        let social = socials[i]
        social.addContent(content)
        nodeSchedule.scheduleJob(content.publishAt, (err, info) => {
          if(social.provider == 'twitter') {
            twitterService.post(req.body.message, req.file, social.accessTokenKey, social.accessTokenSecret, (err, data) => {
              if(err) console.error(err)
              console.log(`Posted to twitter: ${data}`)
            })
          } else if (social.provider == 'facebook') {
            facebookService.post(req.body.message, req.file, social.socialId, social.accessTokenKey, (err, data) => {
              if(err) console.error(err)
              console.log(`Posted to facebook: ${data}`)
            })
          } else {
            console.log(`'${social.provider}' provider not yet implemented`)
          }
        })
      }
    })
  })

  const flashMessage = `Succesfully scheduled: ${req.body.message}`
  req.flash('success', flashMessage)
  res.header('flash-message', flashMessage)
  return res.redirect('/dashboard')
}
