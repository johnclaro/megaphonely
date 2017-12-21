'use strict'

exports.index = (req, res, next) => {
  res.json({'health': 'alive'})
}
