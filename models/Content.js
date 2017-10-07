'use strict'

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    message: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Message is required'},
      }
    },
    publishAt: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterNow(value) {
          if (value > new Date()) {
            throw new Error('Publish date must be greater than current time')
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: (models, cb) => {}
    }
  })
  return Content
}
