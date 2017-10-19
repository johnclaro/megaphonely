require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const exphbs = require('express-handlebars')
const path = require('path')

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
app.use(passport.initialize())
app.use(passport.session())

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
app.get('/register', accountController.getRegister)
app.post('/register', accountController.postRegister)
app.get('/forgot', accountController.getForgot)
app.post('/forgot', accountController.postForgot)
app.get('/resetPassword', accountController.getResetPassword)
app.post('/resetPassword', accountController.postResetPassword)
app.get('/accounts/:id', passportMiddleware.isAuthenticated, accountController.getAccount)
app.get('/contents', contentController.getAll)
app.post('/contents/add', contentController.add)
app.post('/contents/send/twitter', contentController.sendTwitter)

module.exports = app
