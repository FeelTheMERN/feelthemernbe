const express = require('express')
const router = express.Router()

// Routes for admin endpoints
router.use('/admin', require('./admin'))

// Routes for user endpoints
router.use('/user', require('./user'))

module.exports = router