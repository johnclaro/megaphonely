const passport = require('passport')

const Account = require('models').Account

exports.getAccount = (req, res, next) => {
  Account.findById(req.user.id)
  .then(account => {
    res.render('account/profile', {title: 'Profile', account: req.user})
  })
  .catch(err => {
    next(err)
  })
}

exports.getLogin = (req, res, next) => {
  res.render('account/login', {title: 'Login'})
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
      res.redirect('/account')
    })
  })(req, res, next)
}

exports.getRegister = (req, res, next) => {
  res.render('account/register', {title: 'Register'})
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
      if(err) next(err)
      Account.sendEmailToken(req.body.email, req.headers.host)
      res.redirect('/account')
    })
  })
  .catch(err => {
    req.flash('error', err.errors[0].message)
    res.redirect('/register')
    next(err)
  })
}

exports.getForgot = (req, res, next) => {
  res.render('account/forgot', {title: 'Forgot password'})
}

exports.postForgot = (req, res, next) => {
  Account.sendPasswordToken(req.body.email, req.headers.host)
  .then(token => {
    req.flash('success', `Sent email to ${req.body.email}`)
    res.redirect('/forgot')
  }).catch(err => {
    next(err)
  })
}

exports.postResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.body.token}})
  .then(account => {
    if(account) {
      account.update({password: req.body.password, passwordToken: null})
      req.login(account, (err) => {
        if(err) next(err)
        req.flash('success', 'Successfully updated password!')
        res.redirect('/account')
      })
    }
  })
  .catch(err => {
    next(err)
  })
}

exports.getVerify = (req, res, next) => {
  if (Object.keys(req.query).length == 1) {
    const emailToken = req.query.emailToken
    const passwordToken = req.query.passwordToken

    if(emailToken) {
      const emailConfirmationPromises = [
        Account.findOne({where: {emailToken: emailToken}}),
        Account.verifyToken(emailToken)
      ]
      Promise.all(emailConfirmationPromises)
      .then(success => {
        req.flash('success', 'Account verified!')
        req.login(success[0], (err) => {
          if(err) next(err)
          res.redirect('/account')
        })
      })
      .catch(err => {
        next(err)
      })
    } else if (passwordToken) {
      const resetPasswordPromises = [
        Account.findOne({where: {passwordToken: passwordToken}}),
        Account.verifyToken(passwordToken)
      ]
      Promise.all(resetPasswordPromises)
      .then(success => {
        res.render('account/reset_password'), {
          title: 'Reset password',
          token: passwordToken
        }
      })
      .catch(err => {
        req.flash('error', err)
        next(err)
      })
    }
  }
}

exports.getLogout = (req, res, next) => {
  req.logout()
  res.redirect('/')
}
