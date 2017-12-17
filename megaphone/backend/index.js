require('dotenv').config()
const express = require('express')

const app = express()

const home = require('controllers/home')

app.get('/', home.index)

module.exports = app
