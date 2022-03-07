const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const Cart = require('../models/Cart')

const {
    mongoosetoObject
} = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        res.json(req);
    }

    showProducts(req, res, next) {
        Products.findOne({
                slug: req.params.slug
            })
            .then(Products => {
                const products = mongoosetoObject(Products)
                const color = products.color.split(',')
                const size = products.size.split(',')
                products.color = color
                products.size = size.map(size => size.toUpperCase())
                res.render('products/showProducts', {
                    products: products
                })
            })
    }

    Cart(req, res, next) {
        Cart.find({})
            .then(cart => {
                if (cart.length === 0) {
                    req.body.slug = req.params.slug
                    req.body.count = 1
                    const data = new Cart(req.body)
                    data.save(err => {
                        if (err) return res.json(err)
                        res.redirect('back')
                    })
                } else {
                    const check = cart.filter(item => {
                        return item.color === req.body.color && item.size === req.body.size
                    })
                    if (check.length == 0) {
                        req.body.slug = req.params.slug
                        req.body.count = 1
                        const data = new Cart({
                            slug: req.params.slug,
                            count: 1,
                            color: req.body.color,
                            size: req.body.size
                        })
                        data.save(err => {
                            if (err) {
                                res.json(err)
                            }
                            else {
                                res.redirect('back')
                            }
                        })
                        
                    } else {
                        check[0].count += 1
                        Cart.updateOne({
                                _id: check[0]._id
                            }, check[0])
                            .then(() => {
                                res.redirect('back')
                            })
                            .catch(next)
                    }
                }
            })
    }

}

module.exports = new ProductController;