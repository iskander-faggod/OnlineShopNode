const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const varMiddleware = require('./middlewares/variables')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const orderRoutes = require('./routes/order')
const authRoutes = require('./routes/auth')

const login = 'iskander'
const password = 'IoYU6BzMmZzcV2y8'
const url = 'mongodb+srv://Iskander:IoYU6BzMmZzcV2y8@online-shop.y8exm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()
const store = new MongoDBStore({
    collection: 'sessions',
    uri: url,
})


const User = require('./models/user')
const Course = require('./models/course')


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

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/order', orderRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

let start = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            // useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })

    } catch (e) {
        console.log(e)
        if (e) throw e
    }

}
start();

