'use strict'

module.exports = function(db, DataTypes) {
  var Content = db.define('Content', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Message is required'},
      }
    }
  }, {
    classMethods: {
      associate: function (models, cb) {}
    }
  })
  return Content
}
