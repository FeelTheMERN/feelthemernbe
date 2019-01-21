const express = require('express')
const router = express.Router()
const authentication = require('../Utilities/authentication')
const User = require('../models/User')

// POST for user login
router.post('/login', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    User.findOne({ username })
        .then(doc => {
            // Send error if password and username does not match
            if(!doc || doc.password !== password) res.status(401).send("Incorrect username or password")
            
            // Generate token and send to front-end
            const token = authentication.generateToken(doc)
            res.send({
                token,
                isAdmin: false
            })
        })
})

module.exports = router