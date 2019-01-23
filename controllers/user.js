const express = require('express')
const router = express.Router()
const User = require('../models/User')
const multer = require('multer')
const bcrypt = require('bcrypt')
// Requiring authentication methods from the utilities directory
const { isAuthenticated, generateToken } = require('../Utilities/authentication')
// Requiring cloudinary methods from the utilities directory
const { uploadFile } = require('../utilities/cloudinary')

// POST for user login
router.post('/login', (req, res) => {
    const { username, password } = req.body
    // Finding the user based on username
    User.findOne({ username })
        .then(doc => {
            // Send error if password and username does not match
            if(!doc) return res.status(401).send("Incorrect username or password")
            
            // Comparing password from login with password from database
            bcrypt.compare(password, doc.password, (err, response) => {
                if(!response) return res.status(401).send("Incorrect username or password")

                // Generate token and send to front-end
                const token = generateToken(doc)
    
                // Sending token as response
                return res.send({
                    token,
                    isAdmin: false
                })
            })
        })
        .catch(err => res.send(err))
})

// GET request for individual user
router.get('/users/:id', isAuthenticated, (req, res) => {
    const { id } = req.params

    User.findOne({ _id: id })
        .then(doc => res.send(doc))
        .catch(err => res.send(err))
})

// Using multer to store memory??
const storage = multer.memoryStorage()
const upload = multer({ storage })

// POST request for uploading profile picture
router.post('/uploadProfilePicture', upload.single('file'), (req, res) => {
    const { buffer } = req.file
    uploadFile(buffer)
        .then(resp => console.log(resp))
        .catch(err => console.log(err))
})

module.exports = router