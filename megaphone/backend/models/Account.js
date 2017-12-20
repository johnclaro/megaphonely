'use strict'

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {}
  return Account
}
