const Social = require('models').Social
const Content = require('models').Content

exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home')
}

exports.getTerms = (req, res, next) => {
  res.render('legal/terms', {title: 'Terms'})
}

exports.getPrivacy = (req, res, next) => {
  res.render('legal/privacy', {title: 'Privacy'})
}

exports.getDashboard = (req, res, next) => {
  Promise.all([
    Social.findAll({where: {accountId: req.user.id, isConnected: true}}),
    Content.findAll(
      {
        where: {
          accountId: req.user.id,
          isPublished: false
        },
        order: [['publishAt', 'ASC']],
        limit: 5
      })
  ])
  .then(results => {
    return res.render('dashboard', {
      title: 'Dashboard',
      account: req.user,
      socials: results[0],
      contents: results[1]
    })
  })
  .catch(err => {
    return next(err)
  })
}
