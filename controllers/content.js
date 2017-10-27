const fs = require('fs')

const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('twitterUsernames', 'You must choose a twitter account').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('error', errors[0].msg)
    return res.redirect('/dashboard?flash=' + encodeURIComponent(errors[0].msg))
  }

  if(typeof req.body.twitterUsernames == 'string') req.body.twitterUsernames = [req.body.twitterUsernames]

  for(var i=0; i<req.body.twitterUsernames.length; i++) {
    TwitterAccount.findOne({
      where: {username: req.body.twitterUsernames[i], accountId: req.user.id}
    })
    .then(twitterAccount => {
      if(!twitterAccount) {
        const errorMessage = `Twitter account ${req.body.twitterUsernames[i]} does not exist`
        req.flash('error', errorMessage)
        return res.redirect('/dashboard?flash=' + encodeURIComponent(errorMessage))
      } else {
        if(req.file) {
          const uploadsPath = `${__dirname.replace('/controllers', '')}/${req.file.destination}${req.file.filename}`
          fs.readFile(uploadsPath, (err, data) => {
            if(err) return next(err)
            Content.scheduleTwitterContent(
              req.body.message,
              req.body.publishAt,
              twitterAccount.accessTokenKey,
              twitterAccount.accessTokenSecret,
              data.toString('base64')
            )
          })
        } else {
          Content.scheduleTwitterContent(
            req.body.message,
            req.body.publishAt,
            twitterAccount.accessTokenKey,
            twitterAccount.accessTokenSecret
          )
        }
        req.flash('success', 'Succesfully scheduled twitter contents')
        return res.redirect('/dashboard?flash=Success')
      }
    })
    .catch(err => {
      console.error(`Err: ${err}`)
      req.flash('error', err)
      return next(err)
    })
  }
}
