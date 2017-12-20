'use strict'

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {}
  return Account
}
