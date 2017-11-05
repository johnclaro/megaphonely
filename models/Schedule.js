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
      type: Sequelize.INTEGER
    },
    statusMessage: {
      field: 'status_message',
      type: Sequelize.STRING
    },
    isSuccess: {
      field: 'is_success',
      type: Sequelize.BOOLEAN,
      defaultValue: false
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
