const jwt = require('jsonwebtoken')
const passport = require('passport')

// Create a token if the user is authenticated
const generateToken = (user) => {
    const expiration = (user.username === 'admin') ? '1d' : '2h'

    const token = jwt.sign({username: user.username}, process.env.JWT_SECRET_KEY, {expiresIn: expiration})
    return token
}

// Checks token from front-end and proceed if authenticated
const isAuthenticated = (req, res, next) => {
    // Acquiring token from headers sent from the front-end
    const { token } = req.headers
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    next()
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