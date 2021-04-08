const {Schema, model} = require('mongoose')
const User = require('./User')

const contactSchema = new Schema({
    owner: {
        type: Number,
        ref: User,
        required: true
    },
    _id: Number,
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    comment: {
        type: String
    },
    isFavorite: {
        type: Boolean,
        required: true
    },
    phones: [{_id: Number, number: {type: String}}]
})

module.exports = model('Contact', contactSchema)