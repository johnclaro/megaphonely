var jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
    jwt.verify(req.headers['authorization'], process.env.SECRET, (err, data) => {
      if (err) {
        return res.status(401).json({})
      } else {
        next(data)
      }
    })
  } else {
    return res.status(401).json({})
  }
}
