'use strict'

module.exports = (db, Sequelize) => {
  var Social = db.define('Social', {
    accountId: {
      field: 'account_id',
      type: Sequelize.INTEGER,
    },
    socialId: {
      field: 'social_id',
      type: Sequelize.STRING
    },
    username: Sequelize.STRING,
    displayName: {
      field: 'display_name',
      type: Sequelize.STRING
    },
    provider: Sequelize.STRING,
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
    tableName: 'socials'
  })
  return Social
}
