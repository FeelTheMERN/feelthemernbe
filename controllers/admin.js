const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Admin = require('../models/Admin')
// Requiring authentication methods from the Utilities directory
const { isAuthenticated, generateToken } = require('../Utilities/authentication')

// POST for admin login
router.post('/', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    Admin.findOne({ username })
        .then(doc => {
            // Send error if password and username does not match
            if(!doc || doc.password !== password) res.status(401).send("Incorrect username or password")
            
            // Generate token and send to front-end
            const token = generateToken(doc)

            // Sending token as response
            res.send({
                token,
                isAdmin: true
            })
        })
        .catch(err => res.send(err))
})

// GET request that returns all users
router.get('/users', isAuthenticated, (req, res) => {
    User.find({})
        .then(docs => res.send(docs))
        .catch(err => res.send(err))
})

// GET request for individual user
router.get('/users/:id', isAuthenticated, (req, res) => {
    const { id } = req.params
    
    User.findOne({ _id: id})
        .then(doc => res.send(doc))
        .catch(err => res.send(err))
})

// POST request for new client
router.post('/users/new', isAuthenticated, (req, res) => {
    // Assigning constants from the req.body
    const {
        username,
        password,
        contact,
        personalAttribute,
        notes,
        transactionalHistory,
        remainingSession,
        sessions,
        dietaryRequirements,
        mealPlans
    } = req.body
    
    // Making a new user from the constants above
    const newUser = {
        username,
        password,
        contact,
        personalAttribute,
        notes,
        transactionalHistory,
        remainingSession,
        sessions,
        dietaryRequirements,
        mealPlans
    }

    // Creating a new document in users
    User.create(newUser, err => {
        if(err) res.status(500).send("User could not be created")
        res.send(newUser)
    })
})

module.exports = router