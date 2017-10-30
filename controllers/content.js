const fs = require('fs')

const Content = require('models').Content
const Social = require('models').Social

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

  for(var i=0; i<req.body.socialIds.length; i++) {
    // This is a hack based on the value given by the dashboard HTML checkboxes
    var socialId = req.body.socialIds[i].split('-')[0]
    var provider = req.body.socialIds[i].split('-')[1]

    Social.findOne(
      {where: {socialId: socialId, accountId: req.user.id, provider: provider}}
    )
    .then(social => {
      if(!social) return new Error('Social did not exist')
      if(social.provider == 'twitter') {
        Content.scheduleTwitterContent(
          req.user.id,
          req.body.message,
          publishAt,
          social.accessTokenKey,
          social.accessTokenSecret,
          req.file
        )
      } else {
        // TODO: Post facebook content
        console.log(`Not yet implemented!: ${i} | Provider: ${social.provider}`)
      }
    })
    .catch(err => {
      return next(err)
    })
  }

  const flashMessage = `Succesfully scheduled: ${req.body.message}`
  req.flash('success', flashMessage)
  res.header('flash-message', flashMessage)
  return res.redirect('/dashboard')
}
