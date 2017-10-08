'use strict'

const bcrypt = require('bcrypt-nodejs')

module.exports = (db, Sequelize) => {
  var User = db.define('User', {
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: Sequelize.STRING,
    password: {
      type: Sequelize.VIRTUAL,
      allowNull: false,
      set: function(password) {
        this.setDataValue('password', password)
        this.setDataValue('password_hash', bcrypt.hashSync(password, bcrypt.genSaltSync(8), null))
      },
      validate: {
        isLongEnough: (password) => {
          if (password.length < 7) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    }
  })

  User.associate = (models) => {}
  User.findUser = (email, password) => {
    return User.findOne({where: {email:email}})
      .then((user) => {return (null, user)})
      .catch((err) => {return (err, null)})
  }
  return User
}
