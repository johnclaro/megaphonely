'use strict'

const moment = require('moment-shortformat')

const Account = require('models').Account
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
  Promise.all([
    Social.findAll({where: {accountId: req.user.id, isConnected: true}}),
    Content.findAll({
      include: [{
        model: Social,
        where: {accountId: req.user.id},
        include: [{model: Account}]
      }]
    })
  ])
  .then(results => {
    console.log(JSON.stringify(results[1], null, 4))
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results[0],
      contents: results[1]
    })
  })
}
