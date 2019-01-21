const express = require('express')
const app = new express()
const router = express.Router()

const port = 5000

router.use(require('./controllers'))

router.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})