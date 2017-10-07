require('dotenv').config()
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
  .then((err, msg) => {
    app.listen(process.env.PORT, () => {
      console.log(`Example server listening on port ${process.env.PORT}!`)
    })
  })

module.exports = app
