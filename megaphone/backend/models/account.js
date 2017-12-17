'use strict'

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    stripe_id: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    is_email_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    password_hash: Sequelize.STRING,
    password: {
      type: Sequelize.VIRTUAL,
      set: function(password) {
        this.setDataValue('password', password);
        // TODO: Use async to optimize hashing
        this.setDataValue('passwordHash', bcrypt.hashSync(password, salt));
      }
    },
    password_token: Sequelize.STRING,
    verification_token: {
      type: Sequelize.STRING,
      defaultValue: jwt.sign(
        {data: String(Math.floor(new Date() / 1000))}, process.env.SECRET
      )
    },
    verification_token_expires_at: {
      type: Sequelize.DATE,
      defaultValue: () => {
        var tomorrow = new Date();
        return tomorrow.setDate(tomorrow.getDate() + 1);
      }
    }
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {

  }
  return Account;
}
