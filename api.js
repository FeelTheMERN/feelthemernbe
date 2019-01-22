require('dotenv').config()
const express = require('express')
const app = new express()
const mongoose = require('mongoose')
const db = mongoose.connection

const port = 5000

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/finalProject')

db.on('error', () => {
    console.log('Failed to connect to mongoDB')
})

db.once('open', () => {
    console.log('Connected to mongoDB')
})

// Body parser
app.use(express.json())

// Looks for the index.js in the controllers folder
app.use(require('./controllers'))

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})