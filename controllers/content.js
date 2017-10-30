const fs = require('fs')

const Content = require('models').Content
const Social = require('models').Social

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('socialIds', 'You must choose a social account').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.socialIds == 'string') req.body.socialIds = [req.body.socialIds]

  if (!req.body.publishAt) {
      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);
  } else {
    var publishAt = new Date(req.body.publishAt)
  }
  var publishAt = publishAt.toISOString()

  for(var i=0; i<req.body.socialIds.length; i++) {
    Social.findOne({
      where: {socialId: req.body.socialIds[i], accountId: req.user.id}
    })
    .then(social => {
      Content.scheduleTwitterContent(
        req.user.id,
        req.body.message,
        publishAt,
        social.accessTokenKey,
        social.accessTokenSecret,
        req.file
      )
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
