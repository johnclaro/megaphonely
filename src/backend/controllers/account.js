'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const emailer = require('../lib/emailer');
const { jwtSign } = require('../lib/promisify');
const { LoginValidator, SignupValidator } = require('../validators');

const { SECRET, SALT_ROUNDS } = process.env;
const expiresIn = {expiresIn: '1h'};

exports.signup = (req, res, next) => {
  const { firstName, email , password, lastName='' } = req.body;
  const account = { firstName, lastName, email, password };
  SignupValidator.validate(account)
  .then(validated => bcrypt.hash(password, parseInt(SALT_ROUNDS)))
  .then(hashed => Account.create({ firstName, lastName, email, password: hashed }))
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
  .then(validated => Account.findOne({where: { email }}))
  .then(found => found ? bcrypt.compare(password, found.password) : res.status(401).send())
  .then(matched => matched ? jwtSign({}, SECRET, expiresIn) : res.status(401).send())
  .then(token => res.json({ token }))
  .catch(error => next(error))
};

exports.forgot = (req, res, next) => {
  const email = req.body.email;
  const subject = 'Reset your Megaphone password';
  let firstName;

  Account.findOne({where: { email }})
  .then(found => {
    if (!found) return res.status(200).send();
    firstName = found.firstName;
    return jwtSign({ email }, SECRET, expiresIn);
  })
  .then(token => {
    const html = `
    <p>
      Hi ${firstName},
      <br>
      <br>
      Someone recently requested a password change for your Megaphone account.
      If this was you, you can set a new password here:
      <br>
      <br>
      <a href='${req.headers.origin}/reset/${token}'>Reset password</a>
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
    `;
    return emailer.send(email, subject, html);
  })
  .then(sent => res.status(200).send())
  .catch(error => next(error));
};

exports.settings = (req, res, next) => {
  const message = 'settings!';
  return res.json({ message });
};
