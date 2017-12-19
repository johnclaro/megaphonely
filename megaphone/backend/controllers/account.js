'use strict'

const Account = require('models').Account

exports.authenticate = (req, res, next) => {
  console.log(req.body)
  res.json({'cows': 'ok'})
}
