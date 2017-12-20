const jwt = require('jsonwebtoken')
const rp = require('request-promise')

const Account = require('models').Account

exports.new = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body
  const user = {
    first_name: firstName, last_name: lastName, email: email, password: password
  }
  Account.create(user)
  .then(account => {
    const options = {
      uri: `http://${req.headers.host}/login`, body: user, json: true
    }
    return rp.post(options)
  })
  .then(data => res.json(data))
  .catch(error => res.status(500).json({message: error}))
}

exports.login = (req, res, next) => {
  const { email, password } = req.body
  Account.findOne({where: {email: email, password: password}})
  .then(account => {
    if(!account) return res.status(401).json({message: 'Invalid email or password'})
    const data = {email: email}
    const expiresIn = {expiresIn: '1h'}
    jwt.sign(data, process.env.SECRET, expiresIn, (error, token) => {
      if (error) return res.status(500).json({message: 'Could not sign data'})
      res.status(200).json({token: token})
    })
  })
  .catch(error => res.status(500).json({message: error}))
}

exports.forgotpassword = (req, res, next) => {
  res.json({msg: 'success'})
}

exports.settings = (req, res, next) => {
  res.json({msg: 'settings!'})
}
