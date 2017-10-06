'use strict'

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models, cb) {},
      create: function(email, password) {
        console.log(`I got this ${email} and ${password}`)
      }
    }
  })
  return User
}
