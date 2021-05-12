const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
    try{
        const orders = await Order.find({
            'user.userId' : req.user._id
        }).populate('user.userId')
        res.render('order', {
            title: 'Заказы',
            isOrder: true,
            orders : orders.map(o=>{
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })

        })
    } catch (e){
        console.log(e)
        if (e) throw e
    }

})

router.post('/', async (req, res) => {
    try {
        console.log(req.user.cart)
        const user = await req.user.populate('cart.items.courseId').execPopulate()

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {
                ...i.courseId._doc
            }
        }))
        const order = new Order({
            user : {
                name : req.user.name,
                userId : req.user
            },
            courses : courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('order')
    } catch (e) {
        console.log(e)
        if (e) throw e
    }
})

module.exports = router