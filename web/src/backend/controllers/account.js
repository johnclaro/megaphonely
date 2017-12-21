const jwt = require('jsonwebtoken')

const Account = require('models').Account

exports.create = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body
  // Validate here
  Account.create({
    first_name: firstName
    last_name: lastName
    email: email
    password: password
  })
  .then(data => res.json(data))
  .catch(error => res.status(500).json({message: error.errors[0].message}))
}

exports.login = (req, res, next) => {
  const { email, password } = req.body
  Account.findOne({where: {email: email, password: password}})
  .then(account => {
    if(!account) return res.status(401).json({message: 'Invalid credentials'})
    const data = {email: email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (error, token) => {
      if (error) return res.status(500).json({message: 'Could not sign data'})
      return res.status(200).json({token: token})
    })
  })
  .catch(error => res.status(500).json({message: error}))
}

exports.forgotpassword = (req, res, next) => {
  res.json({message: 'success'})
}

exports.settings = (req, res, next) => {
  res.json({message: 'settings!'})
}
