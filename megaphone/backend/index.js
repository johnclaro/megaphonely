require('dotenv').config()
const express = require('express')

const app = express()

const account = require('controllers/account')

app.get('/', account.index)

module.exports = app
