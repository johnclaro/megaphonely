require('dotenv').config()
const express = require('express')
const app = express()

const homeController = require('./controllers/home')

app.get('/', homeController.index)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
