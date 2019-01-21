const mongoose = require('mongoose')

// Data format
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    contactNumber: String
})

module.exports = mongoose.model('Admin', adminSchema)