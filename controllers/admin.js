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
    const { token } = req.headers
    const decoded = jwt.verify(token, 'skyefit')
    next()
}

// POST for admin login
router.post('/', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    User.findOne({ username })
        .then(doc => {
            if(!doc) res.status(401).send("Incorrect username or password")
            // If username and password match, we set req.token with the generated token
            if(doc.password !== password) res.status(401).send("Incorrect username or password")
            
            const token = generateToken(doc)
            res.send({
                token,
                isAdmin: true
            })
        })
})

// GET request that returns all the users
router.get('/users', isAuthenticated, (req, res) => {
    User.find({})
        .then(docs => res.send(docs))
})

router.get('/users/:id', isAuthenticated, (req, res) => {
    const { id } = req.params
    User.find({ _id: id})
        .then(doc => {
            res.send(doc)
        })
})

module.exports = router