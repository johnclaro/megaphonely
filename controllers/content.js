const fs = require('fs')

const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  if(!req.body.message) {
    req.flash('error', 'Cannot leave message empty')
    return res.redirect('/dashboard')
  }

  if (!req.body.twitterIds) {
    req.flash('error', 'You must choose a twitter account')
    return res.redirect('/dashboard')
  }

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
        if(req.file) {
          const uploadsPath = `${__dirname.replace('/controllers', '')}/${req.file.destination}${req.file.filename}`
          fs.readFile(uploadsPath, (err, data) => {
            if (err) {
              console.error('Err:', err)
              return next(err)
            } else {
              Content.scheduleTwitterContent(
                req.body.message,
                req.body.publishAt,
                twitterAccount.accessTokenKey,
                twitterAccount.accessTokenSecret,
                'twitter',
                data.toString('base64')
              )
            }
          })
        } else {
          Content.scheduleTwitterContent(
            req.body.message,
            req.body.publishAt,
            twitterAccount.accessTokenKey,
            twitterAccount.accessTokenSecret
          )
        }
      }
    })
    .catch(err => {
      return next(err)
    })
    req.flash('success', 'Succesfully scheduled twitter contents')
  }

  return res.redirect('/dashboard')
}
