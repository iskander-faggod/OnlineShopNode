const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')

const login = 'iskander'
const password = 'IoYU6BzMmZzcV2y8'
const url = 'mongodb+srv://Iskander:IoYU6BzMmZzcV2y8@online-shop.y8exm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()


const User = require('./models/user')
const Course = require('./models/course')
const Card = require('./models/card')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6098d4cf1e178765920a14d7')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        if (e) throw e
    }

})

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

let start = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'isa',
                name: 'Iskander',
                card: {
                    items: []
                }
            })
            await user.save();
        }
    } catch (e) {
        console.log(e)
        if (e) throw e
    }

}
start();

