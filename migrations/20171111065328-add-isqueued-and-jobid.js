'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('schedules', 'is_queued', {
      field: 'is_queued',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })

    queryInterface.addColumn('schedules', 'job_id', {
      field: 'job_id',
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('schedules', 'isQueued')
    queryInterface.removeColumn('schedules', 'jobId')
  }
};
