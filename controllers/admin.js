const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const moment = require('moment')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const axios = require('axios')
const multer = require('multer')
// Requiring authentication methods from the Utilities directory
const { isAuthenticated, isAdmin } = require('../Utilities/authentication')
const { uploadFile } = require('../utilities/cloudinary')

router.use(isAuthenticated)
// Checks if user is an admin
router.use(isAdmin)

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
        dietaryRequirements
    } = req.body.user

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
                    dietaryRequirements,
                    mealPlans: []
                }
        
                // Creating a new document in users
                User.create(newUser, err => {
                    if(err) return res.status(500).send("User could not be created")
                    User.findOne({ username })
                        .then(user => res.send(user))
                        .catch(err => res.status(404).send('Invalid user'))
                })
            })
        })
})

// PUT route to update user information
router.put('/users/edit', (req, res) => {
    const { user } = req.body
    const { _id } = user

    if(!_id) return res.status(404).send('Invalid user')
    
    // Querying database with _id provided and updating with req.body.user
    User.findByIdAndUpdate( _id, user, { new: true }, (err, user) => {
        if(err) return res.status(404).send('Invalid user')
        return res.send(user)
    })
})

// DELETE routes to delete user from database
router.delete('/users/delete', (req, res) => {
    const { id } = req.body

    // Find user by Id and delete it
    User.findByIdAndRemove(id, (err, user) => {
        if(err) return res.status(404).send('Invalid user')
        return res.send({user, message: 'User successfully deleted'})
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

// POST request for obtaining nutritional information from Nutritionix
router.post('/macros', (req, res) => {
    const { query } = req.body
    console.log(query)
    return res.send('testing')
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

// POST request for uploading profile picture
router.post('/uploadprofilepicture', upload.single('file'), (req, res) => {
    const { buffer } = req.file
    console.log(buffer)
    uploadFile(buffer)
        .then(resp => res.send(resp))
        .catch(err => res.status(500).send('There was an error with Cloudinary'))
})

module.exports = router