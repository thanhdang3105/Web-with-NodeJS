const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')

const {
    mongoosetoObject
} = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        res.json(req.params);
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
            products.size = size.map(size=> size.toUpperCase())
            res.render('products/showProducts',{
                products: products
            })
        })
    }

}

module.exports = new ProductController;