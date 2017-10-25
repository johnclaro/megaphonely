'use strict'

module.exports = (db, Sequelize) => {
  var TwitterAccount = db.define('TwitterAccount', {
    accountId: {
      field: 'account_id',
      type: Sequelize.INTEGER,
    },
    twitterId: {
      field: 'twitter_id',
      type: Sequelize.BIGINT
    },
    username: Sequelize.STRING,
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
    accessTokenSecret: {
      field: 'access_token_secret',
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
    tableName: 'twitter_accounts'
  })
  return TwitterAccount
}
