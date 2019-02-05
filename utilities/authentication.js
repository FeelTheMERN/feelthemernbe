const jwt = require('jsonwebtoken')
const passport = require('passport')
const Admin = require('../models/Admin')
const User = require('../models/User')

// Create a token if the user is authenticated
const generateToken = (user) => {
    const expiration = (user.username === 'admin') ? '1d' : '2h'

    const token = jwt.sign({username: user.username, id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: expiration})
    return token
}

// Checks token from front-end and proceed if authenticated
const isAuthenticated = (req, res, next) => {
    // Acquiring token from headers sent from the front-end
    const { token } = req.headers
    if(!token) res.status(403).send('Unauthorized')
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) return res.status(403).send('Token expired')
        req.username = decoded.username
        console.log(req.user)
    })
    next()
}

// Middleware function that checks if user is admin
const isAdmin = (req, res, next) => {
    const { username } = req

    Admin.findOne({ username })
        .then(user => {
            if(!user) return res.status(401).send('Unauthorized')
            next()
        })
        .catch(err => res.status(404).send('Invalid user'))
}

// Middleware function that checks if user is user
const isUser = (req, res, next) => {
    const { username } = req
    
    User.findOne({ username })
        .then(user => {
            if(!user) return res.status(401).send('Unauthorized')
            next()
        })
        .catch(err => res.status(404).send('Invalid user'))
}

// Authentication using passport
const login = (req, res, next) => {
    // Using local strategy?
    passport.authenticate('local', (err, user, message) => {
        if(!user) return res.status(403).send(message)
        // Saving user to req so we can generate token later
        req.user = user
        req.login(user, next)
    })(req, res, next)
}

// Exporting functions
module.exports = {
    generateToken,
    isAuthenticated,
    login,
    isAdmin,
    isUser
}