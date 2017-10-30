const fs = require('fs')

const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('twitterUsernames', 'You must choose a twitter account').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  console.log(req.file)

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/dashboard')
  }

  if(typeof req.body.twitterUsernames == 'string') req.body.twitterUsernames = [req.body.twitterUsernames]

  if (!req.body.publishAt) {
      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);
  } else {
    var publishAt = new Date(req.body.publishAt)
  }
  var publishAt = publishAt.toISOString()

  for(var i=0; i<req.body.twitterUsernames.length; i++) {
    TwitterAccount.findOne({
      where: {username: req.body.twitterUsernames[i], accountId: req.user.id}
    })
    .then(twitterAccount => {
      if(!twitterAccount) {
        const errorMessage = `Twitter account ${req.body.twitterUsernames[i]} does not exist`
        req.flash('error', errorMessage)
        res.header('flash-message', errorMessage)
        return res.redirect('/dashboard')
      } else {
        Content.scheduleTwitterContent(
          req.body.message,
          publishAt,
          twitterAccount.accessTokenKey,
          twitterAccount.accessTokenSecret,
          req.file
        )
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
