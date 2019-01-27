const express = require('express')
const router = express.Router()
const BlacklistedToken = require('../models/BlacklistedToken')
const { isAuthenticated } = require('../Utilities/authentication')

router.use(isAuthenticated)

// Post route for logging out
router.post('/', (req, res) => {
    // Created a token object with the token and the current time/date
    const token = {
        createdAt: new Date(),
        token: req.body.token
    }

    BlacklistedToken.create(token)

    return res.send(token)
})

module.exports = router