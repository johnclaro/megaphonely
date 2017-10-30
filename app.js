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
const favicon = require('serve-favicon')
const crypto = require('crypto')

const app = express()

// This adds the extension to the filename https://github.com/expressjs/multer/issues/170
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})
const upload = multer({storage: storage})

/**
* Express configs
**/
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials')
}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(validator({
  customValidators: {
    isPastTime: (inputTime) => {
      if(!inputTime) return true
      var rightNow = new Date().getTime()
      var inputTime = new Date(inputTime).getTime()
      return rightNow < inputTime
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
app.get('/terms', homeController.getTerms)
app.get('/privacy', homeController.getPrivacy)
app.get('/login', accountController.getLogin)
app.post('/login', accountController.postLogin)
app.get('/logout', accountController.getLogout)
app.get('/register', accountController.getRegister)
app.post('/register', accountController.postRegister)
app.get('/forgot', accountController.getForgot)
app.post('/forgot', accountController.postForgot)
app.get('/resetpassword/:passwordToken', accountController.getResetPassword)
app.post('/resetpassword/:passwordToken', accountController.postResetPassword)
app.get('/verifypasswordtoken/:passwordToken', accountController.getVerifyPasswordToken)
app.get('/verifyverificationtoken/:verificationToken', accountController.getVerifyVerificationToken)
app.post('/sendverificationtoken', passportMiddleware.isAuthenticated, accountController.postSendVerificationToken)
app.get('/settings', passportMiddleware.isAuthenticated, accountController.getSettings)
app.get('/dashboard', passportMiddleware.isAuthenticated, accountController.getDashboard)

app.post('/content', upload.single('photo'), passportMiddleware.isAuthenticated, contentController.postContent)

/**
* OAuths
**/
const oauthRedirect = {successRedirect: '/dashboard', failureRedirect: '/login'}
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', oauthRedirect))
app.get('/twitter/disconnect/:twitterUsername', passportMiddleware.isAuthenticated, accountController.getTwitterDisconnect)
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))
app.get('/auth/facebook/callback', passport.authenticate('facebook', oauthRedirect))
app.get('/facebook/disconnect/:facebookId', passportMiddleware.isAuthenticated, accountController.getFacebookDisconnect)
/**
* Custom error handlers
* https://github.com/expressjs/vhost/issues/14
**/
app.use((req, res, next) => {
  res.status(404)
  res.render('4xx', {title: '4xx'})
})

app.use((err, req, res, next) => {
  if (req._body == true) {
    if (err == 'Error: 404') {
      // console.error(`Error _body 404: ${err}`)
      res.status(404)
      return res.render('4xx', {title: '4xx'})
    } else {
      // console.error(`Error _body: ${err}`)
      return res.redirect(req.headers.referer)
    }
  } else {
    if (err == 'Error: 404') {
      // console.error(`400: ${err}`)
      res.status(404)
      return res.render('4xx', {title: '4xx'})
    } else {
      // console.error(`500: ${err}`)
      res.status(500)
      return res.render('5xx', {title: '5xx'})
    }
  }
})

module.exports = app
