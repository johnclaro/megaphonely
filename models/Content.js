'use strict'

module.exports = (db, DataTypes) => {
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
      associate: (models, cb) => {}
    }
  })
  return Content
}
