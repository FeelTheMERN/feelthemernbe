const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// Requiring authentication methods from the Utilities directory
const { isAuthenticated, generateToken, login } = require('../Utilities/authentication')

// Ensures passport middleware is run with the login routes
router.use(login)

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    db.findOne({ username })
        .then(user => done(null, user))
        .catch(err => done(err, null))
    })

passport.use(new LocalStrategy(
    (username, password, done) => {
        // If admin is logging in, look through the admin collection, if not look through the user collection
        const collection = (username === "admin") ? Admin : User
        collection.findOne({ username })
            .then((user) => {
                if(!user) return done(null, null, {message: 'Incorrect username or password'})
                
                bcrypt.compare(password, user.password, (err, response) => {
                    if(!response) return done(null, null, {message: 'Incorrect username or password'})
                    return done(null, user)
                })
            })
        }
    )
)

// POST for admin login
router.post('/admin', (req, res) => {
    // Generate token and send to front-end
    const { user } = req
    const token = generateToken(user)
    
    // Sending token as response
    return res.send({
        token,
        isAdmin: true,
        sessions: user.sessions
    })
})

// POST for user login
router.post('/user', (req, res) => {
    // Generate token and send to front-end
    const { user } = req
    const token = generateToken(user)

    // Sending token as response
    return res.send({
        token,
        isAdmin: false,
        id: user._id
    })
})

module.exports = router