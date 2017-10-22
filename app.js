require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('cookie-session')
const flash = require('express-flash')

const app = express()

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
app.post('/resetPassword', accountController.postResetPassword)
app.post('/emailConfirmationToken', accountController.postEmailConfirmationToken)
app.get('/verify', accountController.getVerify)
app.get('/account', passportMiddleware.isAuthenticated, accountController.getAccount)
app.get('/contents', contentController.getAll)
app.post('/contents/add', contentController.add)
app.post('/contents/send/twitter', contentController.sendTwitter)

/**
* Custom error handlers
* https://github.com/expressjs/vhost/issues/14
**/
app.use((req, res, next) => {
  res.status(404)
  res.render('404', {title: 'Not found'})
})

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500)
    res.render('error', {title: 'Error'})
  } else {
    next(err)
  }
})

module.exports = app
