'use strict'

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    accountId: {
      field: 'account_id',
      type: Sequelize.INTEGER,
    },
    socialId: {
      field: 'social_id',
      type: Sequelize.STRING,
    },
    message: Sequelize.STRING,
    isPublished: {
      field: 'is_published',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    publishAt: {
      field: 'publish_at',
      type: Sequelize.DATE
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
