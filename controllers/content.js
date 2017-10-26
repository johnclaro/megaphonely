const fs = require('fs')

const Content = require('models').Content
const TwitterAccount = require('models').TwitterAccount

exports.postContent = (req, res, next) => {
  req.assert('message', 'Message cannot be empty').notEmpty()
  req.assert('twitterIds', 'You must choose a twitter account').notEmpty()
  req.assert('publishAt', 'Cannot schedule in the past').isPastTime()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('error', errors[0].msg)
    return res.redirect('/dashboard?flash=' + encodeURIComponent(errors[0].msg))
  }

  if(typeof req.body.twitterIds == 'string') req.body.twitterIds = [req.body.twitterIds]

  return res.redirect('/dashboard?flash=Success')

  // if(!req.body.message) {
  //   req.flash('error', 'Cannot leave message empty')
  //   return res.redirect('/dashboard')
  // }
  //
  // if (!req.body.twitterIds) {
  //   req.flash('error', 'You must choose a twitter account')
  //   return res.redirect('/dashboard')
  // }
  //
  // if (req.body.twitterIds instanceof Array){
  //   var twitterIds = req.body.twitterIds
  // } else {
  //   var twitterIds = [req.body.twitterIds]
  // }
  //
  // for(var i=0; i<twitterIds.length; i++) {
  //   TwitterAccount.findOne({where: {twitterId: twitterIds[i]}})
  //   .then(twitterAccount => {
  //     if(!twitterAccount) {
  //       req.flash('error', 'No twitter account found')
  //       return res.redirect('/dashboard')
  //     } else {
  //       if(req.file) {
  //         const uploadsPath = `${__dirname.replace('/controllers', '')}/${req.file.destination}${req.file.filename}`
  //         fs.readFile(uploadsPath, (err, data) => {
  //           if (err) {
  //             console.error('Err:', err)
  //             return next(err)
  //           } else {
  //             return Content.scheduleTwitterContent(
  //               req.body.message,
  //               req.body.publishAt,
  //               twitterAccount.accessTokenKey,
  //               twitterAccount.accessTokenSecret,
  //               data.toString('base64')
  //             )
  //           }
  //         })
  //       } else {
  //         return Content.scheduleTwitterContent(
  //           req.body.message,
  //           req.body.publishAt,
  //           twitterAccount.accessTokenKey,
  //           twitterAccount.accessTokenSecret
  //         )
  //       }
  //     }
  //     req.flash('success', 'Succesfully scheduled twitter contents')
  //   })
  //   .catch(err => {
  //     console.error(`Error: ${err}`)
  //     req.flash('error', err)
  //     return next(err)
  //   })
  // }
  //
  // return res.redirect('/dashboard')
}
