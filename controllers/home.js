exports.index = function(req, res) {
  res.send(process.env.SQLALCHEMY_DATABASE_URI)
}
