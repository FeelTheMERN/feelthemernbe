const jwt = require('jsonwebtoken')
const passport = require('passport')
const BlacklistedToken = require('../models/BlacklistedToken')

// Create a token if the user is authenticated
const generateToken = (user) => {
    const token = jwt.sign({username: user.username}, 'skyefit', {expiresIn: '2d'})
    return token
}

// Checks token from front-end and proceed if authenticated
const isAuthenticated = (req, res, next) => {
    // Acquiring token from headers sent from the front-end
    const { token } = req.headers
    const decoded = jwt.verify(token, 'skyefit')
    
    // Checking if token is in the blacklist, if not, proceed
    // Blacklisted tokens are tokens that were created and have been logged out before expiration
    BlacklistedToken.findOne({ token })
        .then(token => {
            if(token) return res.status(401).send('You are not authorized')
            next()
        })
        .catch(err => res.send(err))
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
    login
}