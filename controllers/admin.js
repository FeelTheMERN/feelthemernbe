const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const moment = require('moment')
// Requiring authentication methods from the Utilities directory
const { isAuthenticated, generateToken } = require('../Utilities/authentication')

// POST for admin login
router.post('/', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    Admin.findOne({ username })
        .then(doc => {
            // Send error if password and username does not match
            if(!doc) return res.status(401).send("Incorrect username or password")
            
            // Comparing password from login with password from database
            bcrypt.compare(password, doc.password, (err, response) => {
                if(!response) return res.status(401).send("Incorrect username or password")

                // Generate token and send to front-end
                const token = generateToken(doc)
    
                // Sending token as response
                return res.send({
                    token,
                    isAdmin: true,
                    sessions: doc.sessions
                })
            })
        })
        .catch(err => res.send({
            err,
            message: "You are not admin"
        }))
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

    User.findOne({ username })
        .then(user => {
            // If user exist, send error
            if(user) return res.status(409).send('Username already taken')
            
            // Hashing password to be stored into the database
            bcrypt.hash(password, 10, (err, hash) => {
                // Making a new user from the constants above
                const newUser = {
                    username,
                    password: hash,
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
                    if(err) return res.status(500).send("User could not be created")
                    return res.send(newUser)
                })
            })
        })
})

// POST request that sends back body fat percentage, lean mass and fat mass for males
router.post('/pinches/male', isAuthenticated, (req, res) => {
    // dob needs to be in the following format: 'YYYYMMDD'
    const { chest, abdomen, thigh, dob, weight } = req.body

    const totalPinches = chest + abdomen + thigh
    
    // Using moment and dob to calculate age
    const age = moment().diff(moment(dob, 'YYYYMMDD'), 'years')

    // Calculating body density with formula provided by the client
    const bodyDensity = 1.10938 - (0.0008267 * totalPinches) + (0.0000016 * (totalPinches**2)) - (0.0002574 * age)

    // Using the Siri formula to calculate body fat percentage
    const percBodyFat = ((495.0 / bodyDensity) - 450.0)

    const fatMass = (weight * percBodyFat) / 100.0
    const leanMass = (weight - fatMass)
    
    return res.send({percBodyFat, fatMass, leanMass})
})

// POST request that sends back body fat percentage, lean mass and fat mass for females
router.post('/pinches/female', isAuthenticated, (req, res) => {
    // dob needs to be in the following format: 'YYYYMMDD'
    const { triceps, suprailliac, thigh, dob, weight } = req.body

    const totalPinches = triceps + suprailliac + thigh
    
    // Using moment and dob to calculate age
    const age = moment().diff(moment(dob, 'YYYYMMDD'), 'years')

    // Calculating body density with formula provided by the client
    const bodyDensity = 1.0994921 - (0.0009929  * totalPinches) + (0.0000023 * (totalPinches**2)) - (0.0001392 * age)

    // Using the Siri formula to calculate body fat percentage
    const percBodyFat = ((495.0 / bodyDensity) - 450.0)
    
    const fatMass = (weight * percBodyFat) / 100.0
    const leanMass = (weight - fatMass)

    return res.send({percBodyFat, fatMass, leanMass})
})

module.exports = router