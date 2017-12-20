const jwt = require('jsonwebtoken')

const Account = require('models').Account

exports.login = (req, res, next) => {
  if (req.body.email == 'jkrclaro@outlook.com' && req.body.password == 'postmalone') {
    const data = {email: req.body.email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (err, token) => {
      if (err) {
        res.status(401).json({error: err})
      } else {
        res.json({token: token})
      }
    })
  } else {
    res.status(401).json({error: 'Invalid email or password'})
  }
}

exports.forgotPassword = (req, res, next) => {
  res.json({msg: 'success'})
}

exports.settings = (req, res, next) => {
  res.json({msg: 'settings!'})
}
