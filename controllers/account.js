const passport = require('passport')

const Account = require('models').Account

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
      return res.redirect('/profile')
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
      return res.redirect('/profile')
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
  Account.findOne({where: {passwordToken: req.query.passwordToken}})
  .then(account => {
    if(!account) return next(new Error(404))
    return res.render('account/reset_password', {
      title: 'Reset password',
      passwordToken: req.query.passwordToken
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
      return res.redirect('/profile')
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

exports.getVerify = (req, res, next) => {
  if (Object.keys(req.query).length == 1) {
    const verificationToken = req.query.verificationToken
    const passwordToken = req.query.passwordToken

    if(verificationToken) {
      Promise.all([
        Account.findOne({
          where: {verificationToken: verificationToken, isEmailVerified: false}
        }),
        Account.verifyToken(verificationToken)
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
          return res.redirect('/profile')
        })
      })
      .catch(err => {
        return next(err)
      })
    } else if (passwordToken) {
      Promise.all([
        Account.findOne({where: {passwordToken: passwordToken}}),
        Account.verifyToken(passwordToken)
      ])
      .then(success => {
        const account = success[0]
        if(!account) return next(new Error(404))
        res.redirect(`/resetPassword?passwordToken=${passwordToken}`)
      })
      .catch(err => {
        return next(err)
      })
    }
  }
}

exports.getProfile = (req, res, next) => {
  return res.render('account/profile', {title: 'Profile', account: req.user})
}

exports.getLogout = (req, res, next) => {
  req.logout()
  return res.redirect('/')
}
