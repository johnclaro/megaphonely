'use strict'

module.exports = function(db, DataTypes) {
  var Content = db.define('Content', {
    message: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true
    }
  }, {
    classMethods: {
      associate: function (models, cb) {}
    }
  })
  return Content
}
