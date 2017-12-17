require('dotenv').config()
const express = require('express')

const server = express()

const account = require('./controllers/account')

server.get('/', account.index)

server.use((req, res, next) => {
  res.status(404)
  res.send({'error': 'Page not found'})
})

server.use((error, req, res, next) => {
  if (process.env.NODE_ENV == 'production') {
    res.status(500)
    res.send({'error': 'Internal server error'})
  } else {
    res.send({'error': error})
  }
})

module.exports = server
