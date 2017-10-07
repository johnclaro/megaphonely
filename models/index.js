var fs = require('fs')
  , path = require('path')
  , Sequelize = require('sequelize')
  , _ = require('lodash')
  , db = {};

console.log(` Name: ${process.env.DB_NAME}\n Username: ${process.env.DB_USERNAME}\n Password: ${process.env.DB_PASSWORD}\n Dialect: ${process.env.DB_DIALECT}\n Storage: ${process.env.DB_STORAGE}\n Host: ${process.env.DB_HOST}`)
var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE,
  pool: {
    maxConnections: 1,
    maxIdleTime: 2,
  },
})

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
