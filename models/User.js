'use strict'

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  })
  return User
}
