'use strict'

const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

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

  User.associate = (models) => {}
  User.findUser = (email, password='nothing') => {
    return User.findOne({where: { email: email.toLowerCase() }})
      .then((user) => {
        // TODO: Use async to optimize hashing
        if (password) {
          const passwordMatch = bcrypt.compareSync(password, user.passwordHash)
          if(passwordMatch) return (null, user)
        }
        return (null, user)
      })
      .catch((err) => {return (err, null)})
  }
  User.generatePasswordToken = (email) => {
    return User.findUser(email).then((user) => {
      // TODO: This should return a proper token that expires
      return (null, 'dummy')
    }).catch((err) => {
      return (err, null)
    })
  }
  return User
}
