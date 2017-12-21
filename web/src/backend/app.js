require('dotenv').config()
const express = require('express')
  , cors = require('cors')
  , bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const health = require('./controllers/health')
  , account = require('./controllers/account')
  , jwt = require('./middlewares/jwt')

app.get('/health', health.index)
app.post('/account', account.create)
app.post('/login', account.login)
app.get('/settings', jwt, account.settings)

app.use((req, res, next) => res.status(404).send({message: 'not found'}))

app.use((error, req, res, next) => {
  const env = process.env.NODE_ENV
  const message = env === 'production' ? 'internal server error' : error
  return res.status(500).send({message: message})
})

module.exports = app
