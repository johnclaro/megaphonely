'use strict'

const aws = require('aws-sdk')

const moment = require('moment-shortformat')

const Account = require('models').Account
const Social = require('models').Social
const Content = require('models').Content

const s3 = new aws.S3()

function signS3Filename(data) {
  for(let key in data) {
    if (data[key].filename) {
      const s3File = {
        Bucket: process.env.AWS_S3_BUCKET, Key: data[key].filename, Expires: 20
      }
      s3.getSignedUrl('getObject', s3File, (err, url) => {
        if(err) {
          console.error(err)
        } else {
          data[key].filename = url
        }
      })
    }
  }
}

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
  const currentPage = req.query.page || 1
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
      offset: currentPage
    }),
    Content.count({
      include: [{
        model: Social,
        where: {accountId: req.user.id},
        include: [{model: Account}]
      }]
    })
  ])
  .then(results => {

    const pageCount = Math.floor(results[2] / limit)

    signS3Filename(results[1])
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results[0],
      contents: results[1],
      pagination: {page: currentPage, pageCount: pageCount}
    })
  })
}
