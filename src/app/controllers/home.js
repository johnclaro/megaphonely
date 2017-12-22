'use strict'

const aws = require('aws-sdk')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const moment = require('moment-shortformat')

const Account = require('models').Account
const Social = require('models').Social
const Content = require('models').Content

const s3 = new aws.S3()

function updateContents(data) {
  const format = 'DD/MM/YYYY HH:mm'

  for(let key in data) {
    if (data[key].filename) {
      const cloudfrontUrl = `https://${process.env.CLOUDFRONT}/${data[key].filename}`
      data[key].filename = cloudfrontUrl
    }

    data[key].publishAtReadable = moment(data[key].publishAt).format(format)
    data[key].createdAtReadable = moment(data[key].created_at).format(format)
  }
}

exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home')
}

exports.getTerms = (req, res, next) => {
  res.render('legal/terms', {
    title: 'Terms', account: req.user
  })
}

exports.getPrivacy = (req, res, next) => {
  res.render('legal/privacy', {
    title: 'Privacy', account: req.user
  })
}

exports.getPlans = (req, res, next) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY
  res.render('plans', {
    title: 'Plans', publishableKey: publishableKey, account: req.user
  })
}

exports.postPaymentMethod = (req, res, next) => {
  Account.findById(req.user.id)
  .then(account => {
    stripe.customers.update(account.stripeId, {source: req.body.stripeToken})
    req.flash('success', 'Your default payment method has now been updated')
    return res.redirect('/settings')
  })
}

exports.postPayment = (req, res, next) => {
  Account.findById(req.user.id)
  .then(account => {
    stripe.customers.update(account.stripeId, {source: req.body.stripeToken})
    req.flash('success', 'You successfully paid')
    return res.redirect('/settings')
  })
}

exports.getDashboard = (req, res, next) => {
  const currentPage = req.query.page || 0
  const limit = 5

  Promise.all([
    Social.findAll({where: {accountId: req.user.id, isConnected: true}}),
    Content.findAll({
      include: [{
        model: Social,
        where: {accountId: req.user.id},
        include: [{model: Account}]
      }],
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: currentPage * limit
    })
  ])
  .then(results => {

    const pageCount = Math.floor(results[2] / limit)

    updateContents(results[1])
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results[0],
      contents: results[1]
    })
  })
}