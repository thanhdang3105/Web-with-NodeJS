const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const Cart = require('../models/Cart')
const User = require('../models/User')
const {
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')

module.exports = async function middleware(req, res, next) {
    await TypeProducts.find({})
                      .then(type =>{
                        res.locals.headerMenuType = mutipleMongoosetoObject(type)
                      })
    res.locals.sort = req.query.sort ? req.query.sort : 'default'
    if (req.session.account) {
        await User.findOne({accountName : req.session.account })
        .then(user => {
            if(user){
                res.locals.user = {
                    id: user._id,
                    admin: user.admin,
                    name: user.firstName + ' ' + user.lastName,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                }
            }
        })
        .catch(next)
        await Cart.find({
                userId: res.locals.user ? res.locals.user.id : ''
            })
            .then(cart => {
                arrcart = mutipleMongoosetoObject(cart)
                Products.find({
                        slug: {
                            $in: cart.map(cart => {
                                return cart.slug
                            })
                        }
                    })
                    .then(products => {
                        arrcart.map(cart => {
                            return products.map(product => {
                                if (cart.slug == product.slug) {
                                    cart.name = product.name
                                    cart.price = (Number(product.price.split(',').join('')) * Number(cart.count)).toLocaleString('en-gb')
                                    product.color.split(',').map((color, index) => {
                                        if (color == cart.color) {
                                            cart.img = product.imageProducts[index]
                                        }
                                    })
                                }
                            })
                        })
                    })
                    .catch(err => {
                        res.json(err)
                    })
                res.locals.itemsCart = arrcart
            })
    }
    next()
}