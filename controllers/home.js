'use strict'

const aws = require('aws-sdk')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const moment = require('moment-shortformat')

const Account = require('models').Account
const Social = require('models').Social
const Content = require('models').Content

const s3 = new aws.S3()

function prependCloudFront(data) {
  for(let key in data) {
    if (data[key].filename) {
      const cloudfrontUrl = `https://${process.env.CLOUDFRONT}/${data[key].filename}`
      data[key].filename = cloudfrontUrl
    }
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

exports.postPayment = (req, res, next) => {
  console.log(JSON.stringify(req.body, null, 4))
  stripe.customers.create({
    email: req.body.stripeEmail,
    card: req.body.stripeToken
  })
  .then(customer => {
    stripe.charges.create({
      amount: 2000,
      description: 'Standard',
      currency: 'eur',
      customer: customer.id
    })
    .then(success => {
      console.log(success)
    })
    req.flash('success', 'You successfully paid!')
  })
  res.redirect('/plans')
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

    prependCloudFront(results[1])
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results[0],
      contents: results[1]
    })
  })
}
