const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const Cart = require('../models/Cart')


const {
    mongoosetoObject,
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        let perPage = 24 // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.query.page || 1

        Products
            .find({}) // find tất cả các data
            .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
            .limit(perPage)
            .exec((err, products) => {
                Products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
                    if (err) return next(err);

                    let pages = Math.ceil(count / perPage)

                    const img = mutipleMongoosetoObject(products).map(Products => {
                        return Products.imageProducts[0]
                    })

                    res.render('products/homeProducts', {
                        products: mutipleMongoosetoObject(products).map((product, index) => {
                            if (product.imageProducts.length > 3) {
                                product.imageProducts.length = 3
                            }
                            product.img = img[index]
                            return product
                        }),
                        currentPage: page, // page hiện tại
                        pages, // tổng số các page
                    }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                });
            });
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
                        return item.color === req.body.color && item.size === req.body.size && item.slug === req.body.slug
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
                            } else {
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

    updateCart(req, res, next) {
        Cart.find({})
            .then(cart => {
                const newCart = mutipleMongoosetoObject(cart)
                let data
                newCart.map((item, index) => {
                    console.log(req.body.count[index])
                    if (item.count != req.body.count[index]) {
                        item.count = req.body.count[index]
                        data = item
                    }
                })


                Cart.updateOne({
                        _id: data._id
                    }, data)
                    .then(() => {
                        res.redirect('back')
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }


    removeItemCart(req, res, next) {
        Cart.deleteOne({
                _id: req.query._id,
            })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

}

module.exports = new ProductController;