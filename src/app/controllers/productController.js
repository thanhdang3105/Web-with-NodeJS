const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')

const {
    mongoosetoObject
} = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        res.json(req.body);
    }

    showProducts(req, res, next) {
        Products.findOne({ 
            slug: req.params.slug
        })
        .then(Products => {
            const products = mongoosetoObject(Products)
            const color = products.color.split(',')
            products.color = color
            res.render('products/showProducts',{
                products: products
            })
        })
    }

}

module.exports = new ProductController;