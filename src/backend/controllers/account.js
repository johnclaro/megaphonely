'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Account = require('../models').Account;
const emailer = require('../lib/emailer');
const { jwtSign } = require('../lib/promisify');
const { LoginValidator, SignupValidator, ForgotValidator } = require('../validators');

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

exports.forgot = async (req, res, next) => {
  const email = req.body.email;
  const subject = 'Reset your Megaphone password';

  const validated = await ForgotValidator.validate({ email });
  const found = await Account.findOne({where: { email }})
  if (!found) return res.json({})
  const token = await jwtSign({ email: validated.email }, SECRET, expiresIn);
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
  return res.json({})
};

exports.settings = (req, res, next) => {
  const message = 'settings!';
  return res.json({ message });
};
