const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  if (!req.body.twitterIds) {
    req.flash('error', 'You must choose a twitter account')
    return res.redirect('/dashboard')
  } else {
    if (req.body.twitterIds instanceof Array){
      var twitterIds = req.body.twitterIds
    } else {
      var twitterIds = [req.body.twitterIds]
    }

    for(var i=0; i<twitterIds.length; i++) {
      TwitterAccount.findOne({where: {twitterId: twitterIds[i]}})
      .then(twitterAccount => {
        if(!twitterAccount) {
          req.flash('error', 'No twitter account found')
          return res.redirect('/dashboard')
        } else {
          Content.schedule(
            req.body.message,
            req.body.publishAt,
            twitterAccount.accessTokenKey,
            twitterAccount.accessTokenSecret
          )
        }
      })
      .catch(err => {
        return next(err)
      })
    }

    req.flash('success', 'Succesfully scheduled twitter contents')
    return res.redirect('/dashboard')
  }
}
