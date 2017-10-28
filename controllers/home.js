exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home', {title: 'Home'})
}

exports.getTerms = (req, res, next) => {
  res.render('terms/terms', {title: 'Terms'})
}

exports.getPrivacy = (req, res, next) => {
  res.render('terms/privacy', {title: 'Privacy'})
}
