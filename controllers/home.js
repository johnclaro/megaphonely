'use strict'

const moment = require('moment-shortformat')

const Social = require('models').Social
const Content = require('models').Content

exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home')
}

exports.getTerms = (req, res, next) => {
  res.render('legal/terms', {title: 'Terms'})
}

exports.getPrivacy = (req, res, next) => {
  res.render('legal/privacy', {title: 'Privacy'})
}

exports.getDashboard = (req, res, next) => {

  Social.findAll(
    {
      where: {
        accountId: req.user.id,
        isConnected: true
      },
      include: [{
        model: Content
      }],
      order: [
        [Content, 'publish_at', 'ASC']
      ]
    }
  )
  .then(results => {
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results,
      contents: results[0].Contents
    })
  })
  .catch(err => {
    return next(err)
  })
}
