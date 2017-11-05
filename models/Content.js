'use strict'

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    message: Sequelize.TEXT,
    filename: Sequelize.STRING,
    publishAt: {
      field: 'publish_at',
      type: Sequelize.DATE
    }
  }, {
    tableName: 'contents',
    underscored: true
  })

  Content.associate = (models, cb) => {
    Content.belongsToMany(models.Social, {through: models.Schedule})
  }
  return Content
}
