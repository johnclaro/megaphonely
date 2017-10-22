const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Account = require('models').Account

passport.serializeUser((account, done) => {
  if (account) {
    var today = new Date()
    account.update({lastLoginAt: today.setDate(today.getDate())})
    done(null, account.id)
  } else {
    done(new Error(404))
  }
})

passport.deserializeUser((id, done) => {
  Account.findById(id)
  .then(account => {
    done(null, account)
  })
  .catch(err => {
    done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  Account.findAccount(email, password)
  .then(account => {
    return done(null, account)
  })
  .catch(err => {
    return done(err, null)
  })
}))

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  req.flash('error', 'Please sign in or register to access this page.')
  res.redirect('/login')
}
