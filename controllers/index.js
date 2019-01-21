const express = require('express')
const router = express.Router()

router.use('/admin', require('./admin')) // routes for public endpoints

module.exports = router