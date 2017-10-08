const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('models').User

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  }).catch((err) => {
    done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  User.findUser(email, password).then((user) => {
    return done(null, user)
  }).catch((err) => {
    return done(err, null)
  })
}))

exports.getUser = (req, res, next) => {
  res.send('I am the user profile')
}

exports.getLogin = (req, res, next) => {
  res.send('Login page')
}

exports.getRegister = (req, res, next) => {
  res.send('Signup page')
}

exports.postRegister = (req, res, next) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  }).then((user) => {
    req.logIn(user, (err) => {
      if(err) return next(err)
      return res.redirect(`/users/${user.id}`)
    })
  }).catch((err) => {
    return next(err)
  })
}

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}
