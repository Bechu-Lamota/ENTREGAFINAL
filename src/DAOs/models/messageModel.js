const mongoose = require('mongoose')
const { Schema } = require('./userModel')

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timerecord: {
        type: Date,
        default: Date.now(),
        required: true
    }
})
module.exports = mongoose.model('messages', messageSchema)