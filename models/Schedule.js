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
    }
  }, {
    tableName: 'schedules',
    underscored: true
  })

  Schedule.associate = (models, cb) => {}
  return Schedule
}
