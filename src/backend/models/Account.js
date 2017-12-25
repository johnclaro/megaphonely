'use strict'

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name',
      validate: {
        notEmpty: {args: true, msg: 'Please enter your first name'},
        max: {args: 100, msg: 'First name must be fewer than 100 characters'}
      }
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name',
      validate: {
        max: {args: 100, msg: 'First name must be fewer than 100 characters'}
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: {args: true, msg: 'This email is already taken'},
      validate: {
        notEmpty: {args: true, msg: 'Please enter an email address'},
        isEmail: {args: true, msg: 'Email is not valid'}
      }
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {args: true, msg: 'Please enter a password'}
      }
    }
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {}
  return Account
}
