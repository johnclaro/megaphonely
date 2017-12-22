'use strict'

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    firstName: {field: 'first_name', type: Sequelize.STRING,},
    lastName: {field: 'last_name', type: Sequelize.STRING},
    email: {
      type: Sequelize.STRING,
      unique: {args: true, msg: 'This email is already taken'}
    },
    password: Sequelize.STRING
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {}
  return Account
}
