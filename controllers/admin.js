const express = require('express')
const router = express.Router()
const User = require('../models/User')

// GET request that returns all the users
router.get('/users', (req, res) => {
    User.find({})
        .then(docs => res.send(docs))
})

module.exports = router