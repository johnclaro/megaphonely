'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const emailer = require('../lib/emailer');
const { jwtSign } = require('../lib/promisify');
const {
  LoginValidator, SignupValidator, ForgotValidator, ResetValidator
 } = require('../validators');

const { SECRET, SALT_ROUNDS } = process.env;

exports.signup = async (req, res, next) => {
  try {
    const { firstName, email , password, lastName='' } = req.body;
    const account = { firstName, lastName, email, password };
    const hash = await bcrypt.hash(account.password, parseInt(SALT_ROUNDS));
    const created = await Account.create({ firstName, lastName, email, password: hash });
    return res.json(account);
  } catch (err) {
    let invalid = {};
    for (let error of err.errors) invalid[error.path] = error.message;
    invalid ? res.status(400).json(invalid) : next(err);
  };
};

exports.login = async (req, res, next) => {
  try {
    const INVALID_ERROR_MESSAGE = 'Invalid email or password'
    const { email, password } = req.body;
    const validated = await LoginValidator.validate({ email, password });
    const found = validated ? await Account.findOne({where: { email }}) : null;
    if (!found) return res.status(401).json({ email: INVALID_ERROR_MESSAGE });
    const matched = found ? await bcrypt.compare(password, found.password) : null;
    if (!matched) return res.status(401).json({ email: INVALID_ERROR_MESSAGE });
    const token = matched ? await jwtSign({}, SECRET, {expiresIn: '1h'}) : null;
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.forgot = async (req, res, next) => {
  try {
    const email = req.body.email;
    const subject = 'Reset your Megaphone password';
    const validated = await ForgotValidator.validate({ email });
    const found = await Account.findOne({where: { email }});
    if (!found) return res.json({});
    const token = await jwtSign({ email: validated.email }, SECRET, {expiresIn: '30 days'});
    const html = `
    <p>
      Hi ${found.firstName},
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
    const sent = await emailer.send(validated.email, subject, html);
    return res.json({});
  } catch (err) {
    next(err);
  };
};

exports.reset = async (data, req, res, next) => {
  try {
    const password = req.body.password;
    const email = data.email;
    const hash = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
    const updated = await Account.update({ password: hash }, { where: { email }});
    return res.json({});
  } catch (err) {
    next(err);
  };
};

exports.success = async (req, res, next) => {
  console.log('Success!')
  return res.json({status: 'success'})
}

exports.failed = async (req, res, next) => {
  console.log('Failed!')
  return res.json({status: 'failed'})
}

exports.settings = async (req, res, next) => {
  const message = 'settings!';
  return res.json({ message });
};
