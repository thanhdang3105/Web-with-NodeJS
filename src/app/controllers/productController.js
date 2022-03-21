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

    //[get] /products/:slug
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

    //[post] /products/addCart/:slug
    Cart(req, res, next) {
        if (req.session.accountID) {
            Cart.find({
                    userId: req.session.accountID
                })
                .then(cart => {
                    if (cart.length === 0) {
                        req.body.userId = req.session.accountID
                        req.body.slug = req.params.slug
                        req.body.count = 1
                        let data = new Cart(req.body)
                        data.save(err => {
                            if (err) return res.json(err)
                            Products.findOne({
                                    slug: req.body.slug
                                })
                                .then(products => {
                                    products.color.split(',').map((color, index) => {
                                        if (color == req.body.color) {
                                            req.body.img = products.imageProducts[index]
                                        }
                                    })
                                    req.body.name = products.name
                                    req.body.price = Number(products.price.split(',').join('')) * Number(req.body.count)
                                    req.body._id = products._id
                                    res.json(req.body)
                                })
                                .catch(err => console.error(err))
                        })
                    } else {
                        const check = cart.filter(item => {
                            return item.color === req.body.color && item.size === req.body.size &&
                                item.slug === req.body.slug && item.userId === req.session.accountID
                        })
                        if (check.length == 0) {
                            const data = new Cart({
                                userId: req.session.accountID,
                                slug: req.params.slug,
                                count: 1,
                                color: req.body.color,
                                size: req.body.size
                            })
                            data.save(err => {
                                if (err) {
                                    res.json(err)
                                } else {
                                    Products.findOne({
                                            slug: req.body.slug
                                        })
                                        .then(products => {
                                            products.color.split(',').map((color, index) => {
                                                if (color == req.body.color) {
                                                    req.body.img = products.imageProducts[index]
                                                }
                                            })
                                            req.body.count = data.count
                                            req.body.name = products.name
                                            req.body._id = products._id
                                            req.body.price = Number(products.price.split(',').join('')) * Number(req.body.count)
                                            res.json(req.body)
                                        })
                                        .catch(err => console.error(err))
                                }
                            })

                        } else {
                            check[0].count += 1
                            if(check[0].count >= 10){
                                res.json({
                                    err:'Số lượng tối đa là 10/sản phẩm nếu bạn muốn mua sỉ vui lòng liên hệ hotline'
                                })
                            }
                            Cart.updateOne({
                                    _id: check[0]._id
                                }, check[0])
                                .then(() => {
                                    res.json(check[0])
                                })
                                .catch(next)
                        }
                    }
                })
        } else {
            res.redirect(`/me/user?page=${req.params.slug}`)
        }

    }

    //[post] /products/cart
    updateCart(req, res, next) {
        req.body.userId = req.session.accountID
        Cart.updateOne({
                userId: req.session.accountID,
                slug: req.body.slug,
                color: req.body.color,
                size: req.body.size
            }, req.body)
            .then((cart) => {
                res.json(cart)
            })
            .catch(err => {
                console.log(err)
            })
    }


    removeItemCart(req, res, next) {
        Cart.deleteOne({
                _id: req.query._id,
            })
            .then(() => {
                res.json({
                    message: 'thành công'
                })
            })
            .catch(next)
    }

}

module.exports = new ProductController;