const Social = require('models').Social

exports.getSocialDisconnect = (req, res, next) => {
  Social.update(
    {isConnected: false},
    {where: {
      accountId: req.user.id,
      socialId: req.params.socialId,
      provider: req.params.provider
    }}
  )
  .then(success => {
    res.redirect(req.headers.referer)
  })
  .catch(err => {
    return next(err)
  })
}
