'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    stripeId: {
      field: 'stripe_id',
      type: Sequelize.STRING
    },
    firstName: {
      field: 'first_name',
      type: Sequelize.STRING
    },
    lastName: {
      field: 'last_name',
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: {args: true, msg: 'This email is already taken'}
    },
    isEmailVerified: {
      field: 'is_email_verified',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    passwordHash: {
      field: 'password_hash',
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function(password) {
        this.setDataValue('password', password)
        // TODO: Use async to optimize hashing
        this.setDataValue('passwordHash', bcrypt.hashSync(password, salt))
      }
    },
    passwordToken: {
      field: 'password_token',
      type: Sequelize.STRING
    },
    verificationToken: {
      field: 'verification_token',
      type: Sequelize.STRING,
      defaultValue: jwt.sign({data: String(Math.floor(new Date() / 1000))}, process.env.SECRET)
    },
    verificationTokenExpiresAt: {
      field: 'verification_token_expires_at',
      type: Sequelize.DATE,
      defaultValue: () => {
        var tomorrow = new Date()
        return tomorrow.setDate(tomorrow.getDate() + 1)
      }
    }
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {}
  return Account
}
