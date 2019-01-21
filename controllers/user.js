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

            // Sending token as response
            res.send({
                token,
                isAdmin: false
            })
        })
})

// GET request for individual user
router.get('/users/:id', authentication.isAuthenticated, (req, res) => {
    const { id } = req.params

    User.findOne({ _id: id })
        .then(doc => res.send(doc))
})

module.exports = router