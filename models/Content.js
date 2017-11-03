'use strict'

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    socialId: {
      field: 'social_id',
      type: Sequelize.STRING,
    },
    message: Sequelize.STRING,
    fileformat: Sequelize.STRING,
    filename: Sequelize.STRING,
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

  Content.associate = (models, cb) => {
    Content.belongsTo(models.Social)
  }
  return Content
}
