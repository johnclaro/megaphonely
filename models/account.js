'use strict'

const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
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
      },
      set: function(email) {
        this.setDataValue('email', email.toLowerCase())
      }
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function(password) {
        this.setDataValue('password', password)
        // TODO: Use async to optimize hashing
        this.setDataValue('passwordHash', bcrypt.hashSync(password, salt))
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

  Account.associate = (models) => {}
  Account.findAccount = (email, password='nothing') => {
    return Account.findOne({where: { email: email.toLowerCase() }})
      .then((account) => {
        // TODO: Use async to optimize hashing
        if (password) {
          const passwordMatch = bcrypt.compareSync(password, account.passwordHash)
          if(passwordMatch) return (null, account)
        }
        return (null, account)
      })
      .catch((err) => {return (err, null)})
  }
  Account.generatePasswordToken = (email) => {
    return Account.findAccount(email).then((account) => {
      // TODO: This should return a proper token that expires
      return (null, 'dummy')
    }).catch((err) => {
      return (err, null)
    })
  }
  return Account
}
