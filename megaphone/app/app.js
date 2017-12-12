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
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

const app = express()
const s3 = new aws.S3()
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })
})

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
      if(!inputTime) return false
      if(inputTime == 'Schedule Now') return true
      var rightNow = new Date().getTime()
      var inputTime = new Date(inputTime).getTime()
      return rightNow < inputTime
    },
    isValidFile: (value, mimetype) => {
      console.log(`Got mimetype: ${mimetype}`)
      const validExtensions = [
        // Facebook only allows these images
        'jpg', 'png', 'gif', 'tiff', 'jpeg',

        // Facebook only allows these videos
        'mp4', '3g2', '3gpp', 'asf', 'dat', 'divx', 'dv', 'f4v', 'flv', 'gif',
        'm2ts', 'm4v', 'mkv', 'mod', 'mp4', 'mpe', 'mpeg', 'mpeg4', 'mpg',
        'mts', 'nsv', 'ogm', 'ogv', 'qt', 'tod', 'ts', 'vob', 'wmv', '3gp'
      ]
      if (validExtensions.indexOf(mimetype.toLowerCase()) >= 0) return true
      return false
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
const home = require('controllers/home')
const content = require('controllers/content')
const account = require('controllers/account')
const social = require('controllers/social')

const passportConfig = require('modules/passport')

app.get('/', home.index)
app.get('/terms', home.getTerms)
app.get('/privacy', home.getPrivacy)
app.get('/plans', home.getPlans)
app.post('/payment', home.postPayment)
app.post('/payment/edit', home.postPaymentMethod)
app.get('/dashboard', passportConfig.isAuthenticated, home.getDashboard)

app.get('/login', account.getLogin)
app.post('/login', account.postLogin)
app.get('/logout', account.getLogout)
app.get('/register', account.getRegister)
app.post('/register', account.postRegister)
app.get('/forgot', account.getForgot)
app.post('/forgot', account.postForgot)
app.get('/resetpassword/:passwordToken', account.getResetPassword)
app.post('/resetpassword/:passwordToken', account.postResetPassword)
app.get('/verifypasswordtoken/:passwordToken', account.getVerifyPasswordToken)
app.get('/verifyverificationtoken/:verificationToken', account.getVerifyVerificationToken)
app.post('/sendverificationtoken', passportConfig.isAuthenticated, account.postSendVerificationToken)
app.get('/settings', passportConfig.isAuthenticated, account.getSettings)

app.post('/content', upload.single('media'), passportConfig.isAuthenticated, content.postContent)

app.get('/social/disconnect/:provider/:profileId', passportConfig.isAuthenticated, social.getSocialDisconnect)

/**
* OAuths
**/
const oauthRedirect = {successRedirect: '/dashboard', failureRedirect: '/login'}
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', oauthRedirect))
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'publish_actions']}))
app.get('/auth/facebook/callback', passport.authenticate('facebook', oauthRedirect))
app.get('/auth/linkedin', passport.authenticate('linkedin'))
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', oauthRedirect))
// app.get('/auth/instagram', passport.authenticate('instagram'))
// app.get('/auth/instagram/callback', passport.authenticate('instagram', oauthRedirect))
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
