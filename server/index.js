const express = require('express')
const server = express()
const port = process.env.port || 8000
const {resolve} = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        converted.id = +converted.id
        delete converted._id;
    }
});

server.use(bodyParser.json())

server.use('/api', require('./serverApi'))

server.use(express.static(resolve(__dirname, 'public', 'uploads')))
server.use(express.static(resolve(__dirname, '..', 'client', 'build')))

server.get("/*", (req, res) =>
    res.sendFile(resolve(__dirname, '..', 'client', 'build', "index.html"))
)

async function start() {
    try {
        await mongoose.connect('mongodb+srv://Yuliia:kulibin10602@cluster0.iioix.mongodb.net/ContactsApp', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        server.listen(port, () => {
            console.log('Server is on. Port: ' + port)
        })
    } catch (err) {
        console.log('Server error: ' + err)
    }
}

start()