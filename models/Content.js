'use strict'

module.exports = function(db, DataTypes) {
  var Content = db.define('Content', {
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'contents',
    classMethods: {
      associate: function (models, cb) {}
    }
  })
  return Content
}
