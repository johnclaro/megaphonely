require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

const health = require('./controllers/health')
const account = require('./controllers/account')
const jwt = require('./middlewares/jwt')

server.get('/health', health.index)
server.post('/auth', account.auth)
server.get('/settings', jwt, account.settings)

server.use((req, res, next) => {
  res.status(404)
  res.send({'error': 'Page not found'})
})

server.use((error, req, res, next) => {
  if (process.env.NODE_ENV == 'production') {
    res.status(500).send({'error': 'internal server error'})
  } else {
    res.status(500).send({'error': error})
  }
})

module.exports = server
