const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Create a token if the user is authenticated
const generateToken = (user) => {
    const token = jwt.sign({username: user.username}, 'skyefit', {expiresIn: '1h'})
    return token
}

const isAuthenticated = (req, res, next) => {
    const { username, password } = req.body
    // Finding the user based on username
    User.findOne({ username })
        .then(doc => {
            if(!doc) {
                res.status(401).send("Incorrect username or password")
            }
            // If username and password match, we set req.token with the generated token
            if(doc.password === password) {
                const token = generateToken(doc)
                req.token = token
                next()
            } else {
                res.status(401).send("Incorrect username or password")
            }
        })
}

router.use(isAuthenticated)

// POST for admin login
router.post('/', (req, res) => {
    // Sending the token to front-end
    const { token } = req
    res.send({token})
})

// GET request that returns all the users
router.get('/users', (req, res) => {
    User.find({})
        .then(docs => res.send(docs))
})

module.exports = router