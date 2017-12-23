'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const emailer = require('../lib/emailer');
const { jwtSign } = require('../lib/promisify');
const { LoginValidator, SignupValidator } = require('../validators');
const asaw = require('../middlewares/asaw');

const { SECRET, SALT_ROUNDS } = process.env;
const expiresIn = {expiresIn: '1h'};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, email , password, lastName='' } = req.body;
    const account = { firstName, lastName, email, password };
    const validated = await SignupValidator.validate(account);
    const hash = await bcrypt.hash(validated.password, parseInt(SALT_ROUNDS));
    validated.password = hash;
    const created = await Account.create(validated);
    return res.json(account)
  } catch (err) {
    const message = err.errors[0].message || err.errors[0];
    message ? res.status(400).json({ message }) : next(err);
  };
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const validated = await LoginValidator.validate({ email, password });
  const found = validated ? await Account.findOne({where: { email }}) : null;
  if (!found) return res.status(401).json({});
  const matched = found ? await bcrypt.compare(password, found.password) : null;
  if (!matched) return res.status(401).json({});
  const token = matched ? await jwtSign({}, SECRET, expiresIn) : null;
  return res.json({ token });
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
