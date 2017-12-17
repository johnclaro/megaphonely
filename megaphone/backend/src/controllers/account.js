'use strict'

const Account = require('../models').Account

exports.index = (req, res, next) => {
  Account.findAll()
  .then(accounts => {
    res.send({'data': accounts})
  })
  .catch(error => {
    next(error)
  })
}
