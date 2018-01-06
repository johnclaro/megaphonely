const Social = require('models').Social

exports.getSocialDisconnect = (req, res, next) => {
  console.log(req.user.id)
  console.log(req.params.profileId)
  console.log(req.params.provider)
  Social.update(
    {isConnected: false},
    {where: {
      accountId: req.user.id,
      profileId: req.params.profileId,
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
