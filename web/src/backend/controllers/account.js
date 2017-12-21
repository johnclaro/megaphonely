const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account
const { LoginValidator, SignupValidator } = require('../validators')

exports.create = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body;
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12
  const account = { firstName, lastName, email, password }
  SignupValidator.validate(account)
  .then(validated => {
    return bcrypt.hash(validated.password, saltRounds)
    .then(hashed => {
      validated.password = hashed
      return Promise.resolve(validated)
    })
    .catch(error => Promise.reject(error))
  })
  .then(newAccount => Account.create(newAccount))
  .then(created => res.json(account))
  .catch(error => {
    const message = error.errors[0].message || error.message
    return res.status(500).json({message: message})
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body
  LoginValidator.validate({ email, password })
  .then(valid => Account.findOne({where: { email }}))
  .then(account => {
    if(!account) return res.status(401).json({message: 'Invalid credentials'})
    return bcrypt.compare(password, account.password)
    .then(matched => {
      if (!matched) return res.status(401).json({message: 'Invalid credentials'})
      const expiresIn = {expiresIn: '1h'}
      jwt.sign({}, process.env.SECRET, expiresIn, (error, token) => {
        if (error) return res.status(500).json({message: 'Could not sign data'})
        return res.status(200).json({token: token})
      })
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
