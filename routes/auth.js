const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()
const nodemailer = require('nodemailer')
const sendMail = require('../middlewares/sendEmail')
const {fromMail,auth} = require('../keys/index')

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth
})


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Авторизация',
        loginError: req.flash('login-error'),
        registerError: req.flash('register-error')
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
                req.flash('login-error', 'Wrong password')
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
            req.flash('login-error', 'You are not logged')
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
            req.flash('register-error', 'You have already registered')
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
            mailTransporter.sendMail(sendMail(fromMail, email, name), function (err, data) {
                console.log(data)
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            });
        }
    } catch (e) {
        if (e) throw e
    }
})

module.exports = router