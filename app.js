require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('cookie-session')
const flash = require('express-flash')
const multer = require('multer')
const validator = require('express-validator')

const app = express()
const upload = multer({dest: 'uploads/'})

/**
* Express configs
**/
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials')
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(validator({
  customValidators: {
    isPastTime: (inputTime) => {
      if (inputTime) {
        var rightNow = new Date().getTime()
        var inputTime = new Date(inputTime).getTime()
        return rightNow < inputTime
      } else {
        return true
      }
    }
  }
}))
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/**
* Controllers
**/
const homeController = require('controllers/home')
const contentController = require('controllers/content')
const accountController = require('controllers/account')

const passportMiddleware = require('middlewares/passport')
app.get('/', homeController.index)
app.get('/login', accountController.getLogin)
app.post('/login', accountController.postLogin)
app.get('/logout', accountController.getLogout)
app.get('/register', accountController.getRegister)
app.post('/register', accountController.postRegister)
app.get('/forgot', accountController.getForgot)
app.post('/forgot', accountController.postForgot)
app.get('/resetpassword', accountController.getResetPassword)
app.post('/resetpassword', accountController.postResetPassword)
app.post('/emailVerificationToken', accountController.postEmailVerificationToken)
app.get('/verifyverificationtoken/:verificationToken', accountController.getVerifyVerificationToken)
app.get('/verifypasswordtoken/:passwordToken', accountController.getVerifyPasswordToken)
app.get('/settings', passportMiddleware.isAuthenticated, accountController.getSettings)
app.get('/dashboard', passportMiddleware.isAuthenticated, accountController.getDashboard)
app.get('/twitter/logout/:twitterUsername', passportMiddleware.isAuthenticated, accountController.getTwitterLogout)

app.post('/content', upload.single('photo'), passportMiddleware.isAuthenticated, contentController.postContent)

/**
* OAuths
**/
const oauthRedirect = {successRedirect: '/dashboard', failureRedirect: '/login'}
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', oauthRedirect))

/**
* Custom error handlers
* https://github.com/expressjs/vhost/issues/14
**/
app.use((req, res, next) => {
  res.status(404)
  res.render('4xx', {title: 'Megaphone - 4xx'})
})

app.use((err, req, res, next) => {
  if (req._body == true) {
    return res.redirect(req.headers.referer)
  } else {
    if (err == 'Error: 404') {
      res.status(404)
      return res.render('4xx', {title: 'Megaphone - 4xx'})
    } else {
      console.error(err)
      res.status(500)
      return res.render('5xx', {title: 'Megaphone - 5xx'})
    }
  }
})

module.exports = app
