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
      field: 'publish_at',
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterNow(value) {
          if (value >= new Date()) {
            throw new Error('Publish timestamp must be equal or greater than current time')
          }
        }
      }
    },
    createdAt: {
      field: 'created_at',
      type: Sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE
    }
  }, {
    tableName: 'contents'
  })

  Content.associate = (models, cb) => {}
  return Content
}
