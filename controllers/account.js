const passport = require('passport')

const Account = require('models').Account

exports.getAccount = (req, res, next) => {
  Account.findById(req.user.id)
  .then((account) => {
    res.render('account/profile', {title: 'Profile', account: req.user})
  })
  .catch((err) => {
    next(err)
  })
}

exports.getLogin = (req, res, next) => {
  res.render('account/login', {title: 'Login'})
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    res.redirect('/account')
  }
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
  .then((account) => {
    req.login(account, (err) => {
      if(err) next(err)
      res.redirect('/account')
    })
  })
  .catch((err) => {
    next(err)
  })
}

exports.getForgot = (req, res, next) => {
  res.send('Forgot password')
}

exports.postForgot = (req, res, next) => {
  Account.generatePasswordToken(req.body.email).then((token) => {
    res.send(token)
  }).catch((err) => {
    next(err)
  })
}


exports.getResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.query.token}})
    .then((account) => {
      if (account) {
        // TODO: Render form asking for new password. Token should be
        // embedded in POST request payload
        res.send('Account exist with password token')
      } else {
        res.sendStatus(404)
      }
    }).catch((err) => {
      next(err)
    })
}

exports.postResetPassword = (req, res, next) => {
  Account.findOne({where: {passwordToken: req.body.token}})
    .then((account) => {
      if(account) {
        return account.update({
          password: req.body.password,
          passwordToken: null
        })
      } else {
        res.sendStatus(404)
      }
    })
    .then((account) => {
      res.send('Successfully updated password')
    })
    .catch((err) => {
      next(err)
    })
}

exports.getLogout = (req, res, next) => {
  req.logout()
  res.redirect('/')
}
