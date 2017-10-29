exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home', {title: 'Megaphone'})
}

exports.getTerms = (req, res, next) => {
  res.render('legal/terms', {title: 'Megaphone - Terms'})
}

exports.getPrivacy = (req, res, next) => {
  res.render('legal/privacy', {title: 'Megaphone - Privacy'})
}
