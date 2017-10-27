const passport = require('passport')

const Account = require('models').Account
const TwitterAccount = require('models').TwitterAccount

exports.getSettings = (req, res, next) => {
  Account.findById(req.user.id)
  .then(account => {
    return res.render('account/settings', {title: 'Settings', account: req.user})
  })
  .catch(err => {
    return next(err)
  })
}

exports.getLogin = (req, res, next) => {
  return res.render('account/login', {title: 'Login'})
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, account, info) => {
    if(err) return next(err)
    if(!account) {
      req.flash('error', 'Invalid email or password')
      return res.redirect('/login')
    }
    req.logIn(account, (loginErr) => {
      if(loginErr) return next(err)
      return res.redirect('/dashboard')
    })
  })(req, res, next)
}

exports.getRegister = (req, res, next) => {
  return res.render('account/register', {title: 'Register'})
}

exports.postRegister = (req, res, next) => {
  Account.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })
  .then(account => {
    req.login(account, (err) => {
      if(err) return next(err)
      Account.emailVerificationToken(req.body.email, req.headers.host)
      return res.redirect('/dashboard')
    })
  })
  .catch(err => {
    req.flash('error', err.errors[0].message)
    return next(err)
  })
}

exports.getForgot = (req, res, next) => {
  return res.render('account/forgot', {title: 'Forgot password'})
}

exports.postForgot = (req, res, next) => {
  Account.emailPasswordToken(req.body.email, req.headers.host)
  .then(token => {
    req.flash('success',
    `If a Megaphone account exists for ${req.body.email}, an e-mail will be
    sent with further instructions.`)
    return res.redirect('/forgot')
  }).catch(err => {
    return next(err)
  })
}

exports.getResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.params.passwordToken}})
  .then(account => {
    if(!account) return next(new Error(404))
    return res.render('account/resetpassword', {
      title: 'Reset password', passwordToken: req.params.passwordToken
    })
  })
  .catch(err =>{
    return next(err)
  })
}

exports.postResetPassword = (req, res, next) => {
  Account.update(
    {password: req.body.password, passwordToken: null},
    {
      where: {passwordToken: req.body.passwordToken},
      returning: true,
      plain: true
    }
  )
  .then(success => {
    const account = success[1]
    req.login(account, (err) => {
      if(err) return next(err)
      req.flash('success', 'Successfully updated password!')
      return res.redirect('/dashboard')
    })
  })
  .catch(err => {
    req.flash('error', err.errors[0].message)
    return next(err)
  })
}

exports.postEmailVerificationToken = (req, res, next) => {
  Account.findOne({where: {email: req.body.email, isEmailVerified: false}})
  .then(account => {
    if(!account) return next(new Error(404))
    Account.emailVerificationToken(account.email, req.headers.host)
    req.login(account, (err) => {
      if(err) return next(err)
      req.flash('success',
      `Megaphone has sent a verification email to ${account.email}. Check
      your inbox and click on the link in the email to verify your address.
      If you can't find it, check your spam folder or click the button to
      resend the email.`)
      return res.redirect('/settings')
    })
  })
  .catch(err => {
    return next(err)
  })
}

exports.getVerifyVerificationToken = (req, res, next) => {
  Promise.all([
    Account.findOne(
      {
        where: {
          verificationToken: req.params.verificationToken,
          isEmailVerified: false
        }
      }
    ),
    Account.verifyToken(req.params.verificationToken)
  ])
  .then(success => {
    req.login(success[0], (err) => {
      if(err) return next(err)
      req.flash('success', 'Account verified!')
      success[0].update({
        verificationToken: null,
        verificationTokenExpiresAt: null,
        isEmailVerified: true
      })
      return res.redirect('/dashboard')
    })
  })
  .catch(err => {
    return next(err)
  })
}

exports.getVerifyPasswordToken = (req, res, next) => {
  Promise.all([
    Account.findOne({
      where: {passwordToken: req.params.passwordToken}
    }),
    Account.verifyToken(req.params.passwordToken)
  ])
  .then(success => {
    const account = success[0]
    if(!account) return next(new Error(404))
    res.redirect(`/resetpassword/${req.params.passwordToken}`)
  })
  .catch(err => {
    return next(err)
  })
}

exports.getTwitterLogout = (req, res, next) => {
  TwitterAccount.update(
    {isConnected: false},
    {where: {accountId: req.user.id, username: req.params.twitterUsername}}
  )
  .then(success => {
    req.flash('success', 'Logged out')
    res.redirect(req.headers.referer)
  })
  .catch(err => {
    return next(err)
  })
}

exports.getDashboard = (req, res, next) => {
  TwitterAccount.findAll({
    where: {accountId: req.user.id, isConnected: true}
  })
  .then(twitterAccounts => {
    return res.render('account/dashboard', {
      title: 'Dashboard',
      account: req.user,
      twitterAccounts: twitterAccounts
    })
  })
  .catch(err => {
    return next(err)
  })
}

exports.getLogout = (req, res, next) => {
  req.logout()
  return res.redirect('/')
}
