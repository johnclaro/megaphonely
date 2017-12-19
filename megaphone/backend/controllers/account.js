const jwt = require('jsonwebtoken')

const Account = require('models').Account

exports.auth = (req, res, next) => {
  const expiresIn = {expiresIn: '1h'}
  // TODO: Change 1 to be the user id in the database
  jwt.sign({id: 1}, process.env.SECRET, expiresIn, (err, token) => {
    if (err) {
      res.json({'error': err})
    } else {
      res.json({token: token})
    }
  })
}

exports.settings = (req, res, next) => {
  res.json({success: 'settings!'})
}
