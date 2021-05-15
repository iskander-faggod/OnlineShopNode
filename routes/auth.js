const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Авторизация'
    })
})

router.get('/logout', async (req, res) => {
    await req.session.destroy(()=>{
        res.redirect('/auth/login#login')

    })
})


router.post('/login', async (req,res,next) => {
    try{
        const user = await User.findById('6098d4cf1e178765920a14d7')
        req.session.user = user
        req.session.isAuthenticated = true
        req.session.save(err=>{
            if(err){
                throw err
            }
            res.redirect('/')
            next()
        })

    } catch (e){
        if (e) throw e
        console.log(e)
    }
})

module.exports = router