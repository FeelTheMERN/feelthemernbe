const jwt = require('jsonwebtoken')

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

module.exports = {
    generateToken,
    isAuthenticated
}