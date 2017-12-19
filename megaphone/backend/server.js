require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const server = express()
server.use(cors())

const health = require('./controllers/health')
const account = require('./controllers/account')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.get('/health', health.index)
server.post('/account/authenticate', account.authenticate)

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
