const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Авторизация'
    })
})

router.get('/logout', async (req, res) => {
    await req.session.destroy(() => {
        res.redirect('/auth/login#login')

    })
})


router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                    next()
                })
            } else {
                res.redirect('/auth/login#login')

            }
        } else {
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        if (e) throw e
        console.log(e)
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                password: hashPassword,
                name,
                cart: {
                    items: []
                }
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        if (e) throw e
    }
})

module.exports = router