const Account = require('models').Account

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
      if(err) next(err)
      res.redirect(`/accounts/${account.id}`)
    })
  }).catch((err) => {
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
