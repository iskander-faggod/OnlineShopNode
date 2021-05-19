const {Router} = require('express')
const User = require('../models/user')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const router = Router()
const nodemailer = require('nodemailer')
const sendMail = require('../middlewares/sendEmail')
const resetMail = require('../middlewares/resetEmail')

const {fromMail, auth} = require('../keys/index')

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

router.get('/reset', async (req, res, next) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error'),
    })
})

router.post('/reset', (req, res, next) => {
    try {
        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset');
            }
            const token = buf.toString('hex')
            const candidate = await User.findOne({email: req.body.email})
            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600 * 1000
                await candidate.save()
                await mailTransporter.sendMail(resetMail(candidate.email, fromMail, token))
                res.redirect('auth/login')
            } else {
                req.flash('error', 'Неккоректный email')
                return res.redirect('/auth/reset');

            }
        })
    } catch (e) {
        if (e) throw e
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const candidate = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!candidate) {
            return res.redirect('/auth/register')
        } else {
            res.render('auth/password', {
                title: 'Восстановить пароль',
                error: req.flash('error'),
                userId: candidate._id.toString(),
                token: req.params.token
            })
        }


    } catch (e) {
        if (e) throw e
    }

})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }
    } catch (e) {
        if (e) throw e
    }
})

module.exports = router