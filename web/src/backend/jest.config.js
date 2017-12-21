process.env.NODE_ENV='test'
process.env.DB_NAME='db'
process.env.DB_USERNAME='username'
process.env.DB_PASSWORD='password'
process.env.DB_HOST='host'
process.env.DB_DIALECT='sqlite'
process.env.DB_STORAGE='test.sqlite3'
process.env.DB_LOGGING=true
process.env.SALT_ROUNDS=10
process.env.SECRET='secret'


module.exports = {
  verbose: true,
};
