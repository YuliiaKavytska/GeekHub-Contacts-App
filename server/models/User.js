const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    _id: Number,
    name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = model('Users', userSchema)

module.exports = User