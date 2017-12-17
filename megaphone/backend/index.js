require('dotenv').config()
const express = require('express')

const app = express()

const account = require('controllers/account')

app.get('/', account.index)

app.use((req, res, next) => {
  res.status(404)
  res.send({'error': 'Page not found'})
})

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV == 'production') {
    res.status(500)
    res.send({'error': 'Internal server error'})
  } else {
    res.send({'error': error})
  }
})

module.exports = app
