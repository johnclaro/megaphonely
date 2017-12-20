const jwt = require('jsonwebtoken')

const Account = require('models').Account

exports.login = (req, res, next) => {
  if (req.body.email == 'jkrclaro@outlook.com' && req.body.password == 'postmalone') {
    const data = {email: req.body.email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (err, token) => {
      if (err) {
        res.status(400).json({error: err})
      } else {
        res.json({token: token})
      }
    })
  } else {
    res.status(404).json({error: 'Invalid email or password'})
  }
}

exports.settings = (req, res, next) => {
  res.json({success: 'settings!'})
}
