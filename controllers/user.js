const express = require('express')
const router = express.Router()
const User = require('../models/User')
const multer = require('multer')
// Requiring authentication methods from the utilities directory
const { isAuthenticated, isUser } = require('../utilities/authentication')
// Requiring cloudinary methods from the utilities directory
const { uploadFile } = require('../utilities/cloudinary')

// Run isAuthenticated with all endpoints
router.use(isAuthenticated)
// Checks if user is a user
router.use(isUser)

// GET request for individual user
router.get('/users/:id', (req, res) => {
    const { id } = req.params

    User.findOne({ _id: id })
        .then(user => res.send(user))
        .catch(err => res.send(err))
})

// Using multer to store memory??
const storage = multer.memoryStorage()
const upload = multer({ storage })

// POST request for uploading profile picture
router.post('/uploadprofilepicture', upload.single('file'), (req, res) => {
    const { buffer } = req.file
    uploadFile(buffer)
        .then(resp => res.send(resp))
        .catch(err => res.status(500).send('There was an error with Cloudinary'))
})

module.exports = router