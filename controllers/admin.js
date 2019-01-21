const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Admin = require('../models/Admin')
// Requiring authentication methods from the Utilities directory
const authentication = require('../Utilities/authentication')

// POST for admin login
router.post('/', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    Admin.findOne({ username })
        .then(doc => {
            // Send error if password and username does not match
            if(!doc || doc.password !== password) res.status(401).send("Incorrect username or password")
            
            // Generate token and send to front-end
            const token = authentication.generateToken(doc)

            // Sending token as response
            res.send({
                token,
                isAdmin: true
            })
        })
})

// GET request that returns all users
router.get('/users', authentication.isAuthenticated, (req, res) => {
    User.find({})
        .then(docs => res.send(docs))
})

// GET request for individual user
router.get('/users/:id', authentication.isAuthenticated, (req, res) => {
    const { id } = req.params
    
    User.find({ _id: id})
        .then(doc => res.send(doc))
})

module.exports = router