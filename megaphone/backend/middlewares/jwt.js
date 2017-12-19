var jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
    jwt.verify(req.headers['authorization'], process.env.SECRET, (err, data) => {
      if (err) {
        res.status(401).json({msg: 'Invalid token'})
      } else {
        req.user = data.id
        res.json({msg: 'Authenticated'})
      }
    })
  } else {
    res.status(401).json({msg: 'No token supplied'})
  }
}
