const {Router} = require('express')
const router = Router()

const bcrypt = require('bcrypt')
const saltRounds = 10

const User = require('./models/User')
const Contact = require('./models/Contact')

const multer = require('multer')
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})
const upload = multer({storage: fileStorage}).single('avatar')

router.post('/getUser', async (req, res, next) => {
    try {
        const {body: {email, password}} = req

        const user = await User.findOne({email}, {'__v': false})
        if (!user) {
            throw new Error('User doesn`t exist')
        }
        const sendUser = user.toJSON()

        if (await bcrypt.compare(password, user.password)) {
            delete sendUser.password
            const userContacts = await Contact.find({owner: user._id}, {'owner': false, '__v': false})
            sendUser.contacts = userContacts.length > 0 ? userContacts.map(contact => contact.toJSON()) : null
            res.json({data: sendUser})
        } else {
            throw new Error('Login or password is wrong')
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/signUp', async (req, res) => {
    try {
        const {body: {email, password, name}} = req
        const user = await User.findOne({email})

        if (user) {
            res.status(500).json({message: `User with email: ${email} already exist. Log In, please`})
        }

        const lastUser = await User.find({}).sort({_id: -1}).limit(1);

        let lastId
        if (lastUser.length > 0) {
            lastId = lastUser[0]._id + 1
        } else {
            lastId = 1
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            _id: lastId,
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.end()
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t register user'})
    }
})

router.put('/user/favorite/:id', async (req, res) => {
    try {
        const {params: {id}} = req

        const contact = await Contact.findById(id)

        if (!contact) {
            throw new Error('User can`t be find')
        }

        await Contact.findByIdAndUpdate(id, {isFavorite: true})
        res.end()
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t interact with favorites'})
    }
})

router.delete('/user/favorite/:id', async (req, res) => {
    try {
        const {params: {id}} = req

        const contact = await Contact.findById(id)

        if (!contact) {
            throw new Error('Contact can`t be find')
        }

        await Contact.findByIdAndUpdate(id, {isFavorite: false})
        res.end()
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t interact with favorites'})
    }
})

router.delete('/user/contact/:id', async (req, res) => {
    try {
        const {params: {id}} = req

        const contact = await Contact.findById(id)

        if (!contact) {
            throw new Error('Contact can`t be find')
        }
        await Contact.findByIdAndDelete(id)
        res.end()
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t interact with contacts'})
    }
})

router.post('/user/contact/edit', upload, async (req, res) => {
    try {
        let {file, body} = req
        body._id = JSON.parse(body.id)
        delete body.id

        const contact = await Contact.findById(body._id)
        if (!contact) {
            throw new Error('Contact can`t be find')
        }

        body.phones = JSON.parse(body.phones).map(phone => ({_id: phone.id, number: phone.number}))
        if (file) {
            body.avatar = '/' + file.originalname
        }

        await Contact.findByIdAndUpdate(body._id, body)
        res.end()
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t interact with contacts'})
    }
})

router.post('/user/:userId/contact/new', upload, async (req, res) => {
    try {
        let {file, body, params: {userId}} = req

        const lastContact = await Contact.find({}).sort({_id: -1}).limit(1);

        delete body.id
        if (lastContact.length > 0) {
            body._id = lastContact[0]._id + 1
        } else {
            body._id = 1
        }

        body.owner = +userId
        body.phones = JSON.parse(body.phones).map(phone => ({_id: phone.id, number: phone.number}))
        if (file) {
            body.avatar = '/' + file.originalname
        }

        const newContact = new Contact(body)
        await newContact.save()
        res.json({id: body._id})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Server error. Can`t interact with contacts'})
    }
})

module.exports = router