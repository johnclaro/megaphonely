'use strict'

exports.index = (req, res, next) => {
  return res.json({'health': 'alive'})
}
