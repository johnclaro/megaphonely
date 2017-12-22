'use strict'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const passport = require('passport')
const titleCase = require('titlecase')

const Account = require('models').Account

exports.getSettings = (req, res, next) => {
  Account.findById(req.user.id)
  .then(account => {
    if (account.stripeId) {
      return stripe.customers.retrieve(account.stripeId)
      .then(res => {
        return Promise.resolve({account: account, stripe: res})
      })
    } else {
      return Promise.resolve({account: account})
    }
  })
  .then(data => {
    res.header('Location', '/settings')
    const stripeCustomer = data.stripe ? data.stripe.subscriptions.data[0] : null
    return res.render('account/settings', {
      title: 'Settings',
      account: data.account,
      stripeCustomer: stripeCustomer,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  })
}

exports.getLogin = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  return res.render('account/login', {title: 'Login'})
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, account, info) => {
    if(err) return next(err)
    if(!account) {
      const flashMessage = 'Invalid email or password'
      req.flash('error', flashMessage)
      res.header('flash-message', flashMessage)
      return res.redirect('/login')
    }
    req.logIn(account, (loginErr) => {
      if(loginErr) return next(err)
      res.header('flash-message', 'Successfully logged in')
      return res.redirect('/dashboard')
    })
  })(req, res, next)
}

exports.getRegister = (req, res, next) => {
  if(req.user) return res.redirect('/dashboard')
  return res.render('account/register', {title: 'Register'})
}

exports.postRegister = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('firstName', 'Please enter your first name').notEmpty()
  req.assert('firstName', 'First name must be fewer than 100 characters').len({max: 100})
  req.assert('lastName', 'Last name must be fewer than 100 characters').optional().isLength({max: 100})
  req.assert('password', 'Password must contain at least 6 characters long').len(6)
  req.assert('terms', 'Please agree to the terms of service').notEmpty()
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false})

  const errors = req.validationErrors()
  if(errors) {
    req.flash('errors', errors)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/register')
  }

  const email = req.body.email.toLowerCase()

  Account.create({
    firstName: titleCase(req.body.firstName),
    lastName: titleCase(req.body.lastName),
    email: email,
    password: req.body.password
  })
  .then(account => {
    req.login(account, (err) => {
      if(err) return next(err)
      Account.emailVerificationToken(email, req.headers.host)

      stripe.customers.create({email: email}, (err, customer) => {
        if(err) console.error(err)
        account.update({stripeId: customer.id})
        stripe.subscriptions.create({
          customer: customer.id,
          items: [{plan: 'standard-monthly'}],
          trial_period_days: 14
        })
      })

      res.header('flash-message', 'Register successful')
      return res.redirect('/dashboard')
    })
  })
  .catch(err => {
    req.flash('error', err.errors[0].message)
    res.header('flash-message', err.errors[0].message)
    return res.redirect('/register')
  })
}

exports.getForgot = (req, res, next) => {
  return res.render('account/forgot', {title: 'Forgot password'})
}

exports.postForgot = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail()

  const errors = req.validationErrors()
  if(errors) {
    req.flash('error', errors[0].msg)
    res.header('flash-message', errors[0].msg)
    return res.redirect('/forgot')
  }

  Account.findOne({
    where: {email: req.body.email}
  })
  .then(account => {
    if(account) Account.emailPasswordToken(account.email, req.headers.host)
  })
  .catch(err => {
    return next(err)
  })

  const flashMessage = `If a Megaphone account exists for ${req.body.email}, an e-mail will be sent with further instructions.`
  req.flash('success', flashMessage)
  res.header('flash-message', flashMessage)
  return res.redirect('/forgot')
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
  req.assert('password', 'Password must contain at least 6 characters long').len(6)

  const errors = req.validationErrors()
  if(errors) {
    req.flash('error', errors[0].msg)
    res.header('flash-message', errors[0].msg)
    return res.redirect(`/resetpassword/${encodeURIComponent(req.params.passwordToken)}`)
  }

  Account.findOne({
    where: {passwordToken: req.params.passwordToken}
  })
  .then(account => {
    if(!account) return next(new Error(404))
    account.update({password: req.body.password, passwordToken: null})
    req.login(account, (err) => {
      if(err) return next(err)
      const flashMessage = 'Successfully updated password'
      req.flash('success', flashMessage)
      res.header('flash-message', flashMessage)
      return res.redirect('/dashboard')
    })
  })
}

exports.postSendVerificationToken = (req, res, next) => {
  Account.findOne({
    where: {id: req.user.id, isEmailVerified: false}
  })
  .then(account => {
    if(!account) return next(new Error(404))
    Account.emailVerificationToken(account.email, req.headers.host)
    req.login(account, (err) => {
      if(err) return next(err)
      const flashMessage = `Megaphone has sent a verification email to ${account.email}. Check your inbox and click on the link in the email to verify your address. If you can't find it, check your spam folder or click the button to resend the email.`
      req.flash('success', flashMessage)
      res.header('flashMessage', flashMessage)
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
      success[0].update({
        verificationToken: null,
        verificationTokenExpiresAt: null,
        isEmailVerified: true
      })
      req.flash('success', 'Successfully verified account')
      res.header('flash-message', 'Successfully verified account')
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
    return res.redirect(`/resetpassword/${req.params.passwordToken}`)
  })
  .catch(err => {
    return next(err)
  })
}

exports.getLogout = (req, res, next) => {
  req.logout()
  res.header('flash-message', 'Successfully logged out')
  return res.redirect('/login')
}