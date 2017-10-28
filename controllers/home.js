exports.index = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  res.render('home', {title: 'Home'})
}
