const nodeEnv = process.env.NODE_ENV || ''
if (typeof maybeObject != "undefined") {
   const nodeEnv = `.env.${nodeEnv}`
} else {
  const nodeEnv = '.env'
}
require('dotenv').config({ path: `${nodeEnv}` })
const express = require('express')
const app = express()

const db = require('./models/')

/**
* Controllers
**/
const homeController = require('./controllers/home')
app.get('/', homeController.index)

db
  .sequelize
  .sync()
  .then(function(err, msg) {
    app.listen(process.env.PORT, function () {
      console.log(`Example server listening on port ${process.env.PORT}!`)
    })
  })
