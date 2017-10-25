const Content = require('models').Content

exports.postContent = (req, res, next) => {
  if (req.body.twitterAccessTokenKeys) {
    for(var i=0; i<req.body.twitterAccessTokenKeys.length; i++) {
      Content.schedule(
        req.body.message,
        req.body.publishAt,
        req.body.twitterAccessTokenKeys[i],
        req.body.twitterAccessTokenSecrets[i]
      )
    }
    req.flash('success', 'Succesfully scheduled twitter contents')
    return res.redirect('/dashboard')
  } else {
    req.flash('Failed to schedule twitter contents')
    return next(err)
  }
}
