const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const { LoginValidator, SignupValidator } = require('../validators');
const emailer = require('../services/emailer');
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12

exports.signup = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body;
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
      jwt.sign({}, process.env.SECRET, {expiresIn: '1h'}, (error, token) => {
        if (error) return res.status(500).json({message: 'Could not sign data'})
        return res.status(200).json({token: token})
      })
    })
    .catch(error => Promise.reject(error))
  })
  .catch(error => res.status(500).json({message: error}))
}

exports.forgotPassword = (req, res, next) => {
  const email = req.body.email;
  Account.findOne({where: { email }})
  .then(account => {
    if (!account) return Promise.reject('No email found in database')
    return bcrypt.hash(email, saltRounds)
    .then(token => {
      const subject = 'Reset your megaphone password';
      const html = `
        <p>
          Hi ${account.firstName},
          <br>
          <br>
          Someone recently requested a password change for your Megaphone account.
          If this was you, you can set a new password here:
          <br>
          <br>
          <a href='${req.headers.origin}/verify/${token}'>Reset password</a>
          <br>
          <br>
          If you don't want to change your password or didn't request this, just
          ignore and delete this message.
          <br>
          <br>
          To keep your account secure, please don't forward this email to anyone.
          <br>
          <br>
          Happy Megaphoning!
        </p>
      `
      return Promise.resolve({ email, subject, html })
    })
    .then(data => emailer.send(data.email, data.subject, data.html))
  })
  .then(sent => res.json({message: 'Email sent'}))
  .catch(error => res.status(500).json(error))
}

exports.settings = (req, res, next) => {
  return res.json({message: 'settings!'})
}
