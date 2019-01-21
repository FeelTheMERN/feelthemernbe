const express = require('express')
const router = express.Router()

router.use('/', require('./public')) // routes for public endpoints
router.use('/protected', require('./protected')) // routes for authorized endpoints

module.exports = router