const Content = require('models').Content

exports.postContent = (req, res, next) => {
  Content.schedule(req.body.message, req.body.publishAt)
  .then(success => {
    console.log(`${success}`)
    req.flash('success', success)
    return res.redirect('/dashboard')
  })
  .catch(err => {
    req.flash('error', err)
    return next(err)
  })
}
