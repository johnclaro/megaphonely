require('dotenv').config()
const express = require('express')
const app = express()

const db = require('./models/')

/**
* Controllers
**/
const homeController = require('./controllers/home')
const contentController = require('./controllers/content')
app.get('/', homeController.index)
app.post('/content/add', contentController.add)

module.exports = app
