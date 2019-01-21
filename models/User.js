const mongoose = require('mongoose')

// Data format
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    contact: {
        email: String,
        contactNumber: String
    },
    personalAttribute: {
        firstName: String,
        lastName: String,
        DOB: Date,
        gender: String,
        height: Number,
        weightLog: [Number],
        goalWeight: Number,
        bodyFatLog: [Number],
        goalBodyFat: Number,
        goal: String
    },
    notes: String,
    transactionalHistory: [
        {
            date: Date,
            amountReceived: Number,
            pricePerSession: Number,
            totalSessions: Number
        }
    ],
    sessions: [
        {
            date: Date,
            time: Date,
            location: String
        }
    ],
    dietaryRequirements: [String],
    mealPlans: [
        {
            day1: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day2: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day3: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day4: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day5: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day6: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
            day7: [
                [
                    {
                        qty: String,
                        foodItem: String
                    }
                ]
            ],
        }
    ]
})

module.exports = mongoose.model('User', userSchema)