const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const mongoose = require('mongoose')

const login = 'iskander'
const password = 'IoYU6BzMmZzcV2y8'
const url = 'mongodb+srv://Iskander:IoYU6BzMmZzcV2y8@online-shop.y8exm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

let start = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true
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

