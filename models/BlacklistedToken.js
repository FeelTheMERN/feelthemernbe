const mongoose = require('mongoose')

// Data format
const blacklistedTokenSchema = new mongoose.Schema({
    createdAt: Date,
    token: String
})

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema)