'use strict'

module.exports = (db, Sequelize) => {
  var FacebookAccount = db.define('FacebookAccount', {
    accountId: {
      field: 'account_id',
      type: Sequelize.INTEGER,
    },
    facebookId: {
      field: 'facebook_id',
      type: Sequelize.STRING
    },
    displayName: {
      field: 'display_name',
      type: Sequelize.STRING
    },
    profilePicture: {
      field: 'profile_picture',
      type: Sequelize.STRING
    },
    accessTokenKey: {
      field: 'access_token_key',
      type: Sequelize.STRING
    },
    isConnected: {
      field: 'is_connected',
      type: Sequelize.BOOLEAN,
      defaultValue: true
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
    tableName: 'facebook_accounts'
  })
  return FacebookAccount
}
