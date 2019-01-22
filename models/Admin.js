const mongoose = require('mongoose')

// Data format
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    contactNumber: String,
    sessions: [
        {
            date: Date,
            time: Date,
            location: String
        }
    ]
})

module.exports = mongoose.model('Admin', adminSchema)