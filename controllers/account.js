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
  Account.findOne({where: {passwordToken: req.query.token}})
    .then((account) => {
      if (account) {
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
          password: req.body.password
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
