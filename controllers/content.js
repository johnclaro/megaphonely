const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  if(!req.body.twitterIds) {
    req.flash('error', 'You must choose a social media account to be posted')
    return res.redirect('/dashboard')
  }
  for(var i=0; i<req.body.twitterIds.length; i++) {
    TwitterAccount.findOne({where: {twitterId: req.body.twitterIds[i]}})
    .then(twitterAccount => {
      if(!twitterAccount) {
        req.flash('error', 'No twitter account found')
        res.redirect('/dashboard')
      } else {
        Content.schedule(
          req.body.message,
          req.body.publishAt,
          twitterAccount.accessTokenKey,
          twitterAccount.accessTokenSecret
        )
        req.flash('success', 'Succesfully scheduled twitter contents')
        return res.redirect('/dashboard')
      }
    })
    .catch(err => {
      console.error(`Oh no: ${err}`)
    })
  }
}
