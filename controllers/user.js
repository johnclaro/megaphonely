const passport = require('passport')
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

exports.getUser = (req, res, next) => {
  res.send('I am the user profile')
}

exports.getLogin = (req, res, next) => {
  res.send('Login page')
}

exports.postLogin = (req, res, next) => {
  email = req.body.email
  password = req.body.password

  
}

exports.getAllUsers = (req, res, next) => {
  User.findAll().then((users) => {
    res.send(users)
  }).catch((err) => {
    return next(err)
  })
}

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  res.redirect('/login')
}
