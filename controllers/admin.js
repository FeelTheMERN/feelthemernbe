const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const moment = require('moment')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// Requiring authentication methods from the Utilities directory
const { isAuthenticated } = require('../Utilities/authentication')

router.use(isAuthenticated)

// GET request that returns all users
router.get('/users', (req, res) => {
    User.find({})
        .then(users => res.send(users))
        .catch(err => res.send(err))
})

// GET request for individual user
router.get('/users/:id', (req, res) => {
    const { id } = req.params
    
    User.findOne({ _id: id})
        .then(user => res.send(user))
        .catch(err => res.send(err))
})

// POST request for new client
router.post('/users/new', (req, res) => {
    
    // Assigning constants from the req.body
    const {
        username,
        password,
        contact,
        personalAttribute,
        notes,
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
                    transactionalHistory: [],
                    remainingSession: 0,
                    sessions: [],
                    dietaryRequirements: [],
                    mealPlans: []
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
router.post('/pinches/male', (req, res) => {
    const { chest, abdomen, thigh, weight, dob } = req.body

    // dob needs to be in the following format: 'YYYYMMDD'
    const dobFormated = dob.replace(/-/g, '')

    const totalPinches = +chest + +abdomen + +thigh
    
    // Using moment and dob to calculate age
    const age = moment().diff(moment(dobFormated, 'YYYYMMDD'), 'years')

    // Calculating body density with formula provided by the client
    const bodyDensity = 1.10938 - (0.0008267 * totalPinches) + (0.0000016 * (totalPinches**2)) - (0.0002574 * age)

    // Using the Siri formula to calculate body fat percentage
    const percBodyFat = ((495.0 / bodyDensity) - 450.0)

    const fatMass = (weight * percBodyFat) / 100.0
    const leanMass = (weight - fatMass)
    
    return res.send({
        percBodyFat,
        fatMass,
        leanMass
    })
})

// POST request that sends back body fat percentage, lean mass and fat mass for females
router.post('/pinches/female', (req, res) => {
    const { tricep, suprailiac, thigh, weight, dob } = req.body

    // dob needs to be in the following format: 'YYYYMMDD'
    const dobFormated = dob.replace(/-/g, '')

    const totalPinches = +tricep + +suprailiac + +thigh
    
    // Using moment and dob to calculate age
    const age = moment().diff(moment(dob, 'YYYYMMDD'), 'years')

    // Calculating body density with formula provided by the client
    const bodyDensity = 1.0994921 - (0.0009929  * totalPinches) + (0.0000023 * (totalPinches**2)) - (0.0001392 * age)

    // Using the Siri formula to calculate body fat percentage
    const percBodyFat = ((495.0 / bodyDensity) - 450.0)
    
    const fatMass = (weight * percBodyFat) / 100.0
    const leanMass = (weight - fatMass)

    return res.send({
        percBodyFat,
        fatMass,
        leanMass
    })
})

module.exports = router