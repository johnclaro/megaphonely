'use strict'

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
      set: function(val) {
        this.setDataValue('password', val)
        this.setDataValue('password_hash', process.env.DB_SALT + val)
      },
      validate: {
        isLongEnough: (val) => {
          if (val.length < 7) {
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
