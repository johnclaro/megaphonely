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
  res.render('account/register')
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

      Account.sendEmailConfirmation(req.body.email)
      res.redirect('/account')
    })
  })
  .catch(err => {
    next(err)
  })
}

exports.getForgot = (req, res, next) => {
  res.render('account/forgot', {title: 'Forgot password'})
}

exports.postForgot = (req, res, next) => {
  Account.generatePasswordToken(req.body.email)
  .then(token => {
    res.render('account/forgot', {title: 'Forgot password'})
  }).catch(err => {
    next(err)
  })
}


exports.getResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.query.token}})
  .then(account => {
    if (account) {
      res.render('account/reset_password', {
        title: 'Reset password',
        token: req.query.token
      })
    } else {
      res.sendStatus(404)
    }
  })
  .catch(err => {
    next(err)
  })
}

exports.postResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.body.token}})
  .then(account => {
    if(account) {
      return account.update({password: req.body.password,passwordToken: null})
    } else {
      res.sendStatus(404)
    }
  })
  .then(account => {
    req.flash('success', 'Successfully updated password!')
    res.redirect('/')
  })
  .catch(err => {
    next(err)
  })
}

exports.getEmailVerification = (req, res, next) => {
  Account.findOne({where: {confirmationToken: req.query.confirmation}})
  .then(account => {
    if(account) {
      account.update({confirmationToken: null})
      req.flash('success', 'Account verified!')
      req.login(account, (err) => {
        if(err) next(err)
        res.redirect('/account')
      })
    } else {
      res.sendStatus(404)
    }
  })
  .catch(err => {
    next(err)
  })
}

exports.getLogout = (req, res, next) => {
  req.logout()
  res.redirect('/')
}
