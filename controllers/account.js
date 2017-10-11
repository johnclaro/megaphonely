const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Account = require('models').Account

passport.serializeUser((account, done) => {
  done(null, account.id)
})

passport.deserializeUser((id, done) => {
  Account.findById(id).then((account) => {
    done(null, account)
  }).catch((err) => {
    done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  Account.findAccount(email, password).then((account) => {
    return done(null, account)
  }).catch((err) => {
    return done(err, null)
  })
}))

exports.getAccount = (req, res, next) => {
  res.send('I am the account profile')
}

exports.getLogin = (req, res, next) => {
  res.send('Login page')
}

exports.getRegister = (req, res, next) => {
  res.send('Signup page')
}

exports.postRegister = (req, res, next) => {
  Account.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  }).then((account) => {
    req.logIn(account, (err) => {
      if(err) return next(err)
      return res.redirect(`/accounts/${account.id}`)
    })
  }).catch((err) => {
    return next(err)
  })
}

exports.getForgot = (req, res, next) => {
  res.send('Forgot password')
}

exports.postForgot = (req, res, next) => {
  Account.generatePasswordToken(req.body.email).then((token) => {
    return res.send(token)
  }).catch((err) => {
    return next(err)
  })
}

exports.getResetPassword = (req, res, next) => {
  res.send({'Get reset password token:': req.query.token})
}

exports.postResetPassword = (req, res, next) => {
  res.send({'Post reset password token:': req.query.token})
}

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}
