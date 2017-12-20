const jwt = require('jsonwebtoken')

const Account = require('models').Account

exports.new = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body
  const user = {
    first_name: firstName, last_name: lastName, email: email, password: password
  }
  Account.create(user)
  .then(account => res.status(201).json({msg: 'success'}))
  .catch(error => next(err))
}

exports.login = (req, res, next) => {
  if (req.body.email == 'johndoe@gmail.com' && req.body.password == 'johndoe') {
    const data = {email: req.body.email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (err, token) => {
      if (err) {
        res.status(401).json({error: err})
      } else {
        res.status(201).json({token: token})
      }
    })
  } else {
    res.status(401).json({error: 'Invalid email or password'})
  }
}

exports.forgotpassword = (req, res, next) => {
  res.json({msg: 'success'})
}

exports.settings = (req, res, next) => {
  res.json({msg: 'settings!'})
}
