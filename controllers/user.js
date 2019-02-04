const express = require('express')
const router = express.Router()
const User = require('../models/User')
const multer = require('multer')
const bcrypt = require('bcrypt')
// Requiring authentication methods from the utilities directory
const { isAuthenticated, isUser } = require('../utilities/authentication')
// Requiring cloudinary methods from the utilities directory
const { uploadFile } = require('../utilities/cloudinary')

// Run isAuthenticated with all endpoints
router.use(isAuthenticated)
// Checks if user is a user
router.use(isUser)

router.get('/users', (req, res) => {
    const { username } = req

    User.findOne({ username })
        .then(user => {
            if(!user) return res.status(404).send('Invalid user')
            return res.send(user._id)
        })
        .catch(err => res.status(404).send('Invalid user'))
})

// GET request for individual user
router.get('/users/:id', (req, res) => {
    const { id } = req.params

    User.findOne({ _id: id })
        .then(user => res.send(user))
        .catch(err => res.send(err))
})

router.put('/users/:id/editpassword', (req, res) => {
    const { id } = req.params
    const { password } = req.body
    if(!password) return res.status(400).send('Please enter a valid password')

    bcrypt.hash(password, 10, (err, hash) => {
        if(err) return res.status(400).send('Please enter valid password')

        User.findByIdAndUpdate( id, {password: hash}, { new: true }, (err, user) => {
            if(err) return res.status(404).send('Invalid user')
            return res.send(user)
        })
    })
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