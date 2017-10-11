require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

/**
* Express configs
**/
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
app.get('/', homeController.index)
app.get('/login', accountController.getLogin)
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {res.redirect(`/accounts/${req.user.id}`)})
app.get('/register', accountController.getRegister)
app.post('/register', accountController.postRegister)
app.get('/forgot', accountController.getForgot)
app.post('/forgot', accountController.postForgot)
app.get('/resetPassword', accountController.getResetPassword)
app.post('/resetPassword', accountController.postResetPassword)
app.get('/accounts/:id', accountController.isAuthenticated, accountController.getAccount)
app.get('/contents', contentController.getAll)
app.post('/contents/add', contentController.add)
app.post('/contents/send/twitter', contentController.sendTwitter)

module.exports = app
