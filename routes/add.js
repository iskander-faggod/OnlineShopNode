const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    try {
        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img
        })

        await course.save()

        res.redirect('/courses')
    } catch (e) {
        if (e) throw e
    }
})

module.exports = router