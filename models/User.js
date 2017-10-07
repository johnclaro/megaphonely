'use strict'

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    email: {
      type: DataTypes.STRING,
      validate: {isEmail: true}
    },
    password_hash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set: function(val) {
        this.setDataValue('password', val)
        this.setDataValue('password_hash', this.salt + val)
      },
      validate: {
        isLongEnough: function(val) {
          if (val.length < 7) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    }
  }, {
    tableName: 'users',
    classMethods: {
      associate: function (models, cb) {}
    }
  })
  return User
}
