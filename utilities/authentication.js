const jwt = require('jsonwebtoken')
const passport = require('passport')

// Create a token if the user is authenticated
const generateToken = (user) => {
    const token = jwt.sign({username: user.username}, 'skyefit', {expiresIn: '1h'})
    return token
}

// Checks token from front-end and proceed if authenticated
const isAuthenticated = (req, res, next) => {
    const { token } = req.headers
    const decoded = jwt.verify(token, 'skyefit')
    next()
}

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, message) => {
        if(!user) return res.status(403).send(message)
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