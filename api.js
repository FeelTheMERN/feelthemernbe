const express = require('express')
const app = new express()
const router = express.Router() // To use express router
const mongoose = require('mongoose')
const db = mongoose.connection

const port = 5000

mongoose.connect('mongodb://localhost:27017/finalProject')

db.on('error', () => {
    console.log('Failed to connect to mongoDB')
})

db.once('open', () => {
    console.log('Connected to mongoDB')
})

// Looks for the index.js in the controllers folder
app.use(require('./controllers'))

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})