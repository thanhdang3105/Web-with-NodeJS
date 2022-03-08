const Products = require('../models/Products')
const Cart = require('../models/Cart')
const {
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')

module.exports = function middleware(req, res, next) {

    Cart.find({})
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
                                product.color.split(',').map((color,index) => {
                                    if(color == cart.color){
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
        .catch(err => console.log(err))
    next()
}