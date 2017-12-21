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
server.post('/account', account.create)
server.post('/login', account.login)
server.get('/settings', jwt, account.settings)

server.use((req, res, next) => res.status.send({message: 'not found'}))

server.use((error, req, res, next) => {
  const env = process.env.NODE_ENV
  const message = env === 'production' ? 'internal server error' : error
  console.error(message)
  return res.status(500).send({message: message})
})

module.exports = server
