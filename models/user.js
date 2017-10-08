'use strict'

module.exports = (db, Sequelize) => {
  var User = db.define('User', {
    email: {
      type: Sequelize.STRING,
      validate: {isEmail: true}
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
  }, {
    classMethods: {
      associate: (models, cb) => {}
    }
  })
  return User
}
