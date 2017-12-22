'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const emailer = require('../lib/emailer');
const { jwtSign } = require('../lib/promisify');
const { LoginValidator, SignupValidator } = require('../validators');

const { SECRET, SALT_ROUNDS } = process.env;

exports.signup = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body;
  const account = { firstName, lastName, email, password };
  SignupValidator.validate(account)
  .then(validated => {
    return bcrypt.hash(validated.password, parseInt(SALT_ROUNDS))
    .then(hashed => {
      validated.password = hashed;
      return Promise.resolve(validated);
    });
  })
  .then(newAccount => Account.create(newAccount))
  .then(created => res.json(account))
  .catch(error => {
    // SequelizeUniqueConstraintError or ValidationError
    const message = error.errors[0].message || error.errors[0];
    message ? res.status(400).json({ message }) : next(error);
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  LoginValidator.validate({ email, password })
  .then(valid => Account.findOne({where: { email }}))
  .then(account => {
    if(!account) return res.status(401).send()
    return bcrypt.compare(password, account.password)
    .then(matched => {
      if (!matched) return res.status(401).send()
      return jwtSign({}, SECRET, {expiresIn: '1h'})
      .then(token => res.json({ token }))
    })
  })
  .catch(error => next(error))
}

exports.forgot = (req, res, next) => {
  const email = req.body.email;
  Account.findOne({where: { email }})
  .then(account => {
    if (!account) return res.status(200).send()
    return jwtSign({ email }, SECRET, {expiresIn: '1h'})
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
      return emailer.send(email, subject, html)
    })
  })
  .then(sent => res.status(200).send())
  .catch(error => next(error))
}

exports.settings = (req, res, next) => {
  const message = 'settings!'
  return res.json({ message })
}
