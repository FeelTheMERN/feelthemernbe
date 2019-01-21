const express = require('express')
const app = new express()
const router = express.Router() // To use express router

const port = 5000

router.use(require('./controllers')) // Looks for the index.js in the controllers folder

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})