'use strict'

module.exports = (db, Sequelize) => {
  var Schedule = db.define('Schedule', {
    contentId: {
      field: 'content_id',
      type: Sequelize.INTEGER
    },
    socialId: {
      field: 'social_id',
      type: Sequelize.INTEGER
    },
    statusCode: {
      field: 'status_code',
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    statusMessage: {
      field: 'status_message',
      type: Sequelize.STRING
    },
    isPublished: {
      field: 'is_published',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  }, {
    tableName: 'schedules',
    underscored: true
  })

  Schedule.associate = (models, cb) => {}
  return Schedule
}
