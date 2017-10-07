require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const db = require('models')

/**
* Express configs
**/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/**
* Controllers
**/
const homeController = require('controllers/home')
const contentController = require('controllers/content')
app.get('/', homeController.index)
app.get('/contents', contentController.getAll)
app.post('/contents/add', contentController.add)

module.exports = app
