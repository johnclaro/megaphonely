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
      }
    },
    passwordHash: Sequelize.STRING,
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
  User.findUser = (email, password) => {
    var email = email.toLowerCase()
    return User.findOne({where: {email:email}})
      .then((user) => {
        // TODO: Use async to optimize hashing
        const passwordMatch = bcrypt.compareSync(password, user.passwordHash)
        if(passwordMatch) return (null, user)
      })
      .catch((err) => {return (err, null)})
  }
  return User
}
