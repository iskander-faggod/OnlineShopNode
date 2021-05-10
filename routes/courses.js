const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId', 'name').select('price title img');
        const userName = req.user.name
        console.log(userName)
        const fixedCourses = courses.map(i => i.toObject());
        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            courses: fixedCourses,
            name : userName
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course: course
    })
})

router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/remove', async (req, res) => {

    try {
        await Course.deleteOne({_id: req.body.id})
        // await Course.findById(req.body.id).remove()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
        if (e) throw e
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course: course.toObject()
    })
})

module.exports = router