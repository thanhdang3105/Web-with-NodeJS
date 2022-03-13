const Products = require('../models/Products')
const { mutipleMongoosetoObject } = require('../../resources/util/mongoose')
// const {mutipleMongoosetoObject} = require('../../util/mongoose')

class SiteController {

    //[Get] /
    index(req, res, next) {
        Products.find({})
            .then(products => {
                const img = mutipleMongoosetoObject(products).map(Products => {
                         return Products.imageProducts[0]
                })
                const newArrival = mutipleMongoosetoObject(products).map((product,index) => {
                    if(product.imageProducts.length > 3) {
                        product.imageProducts.length = 3
                    }
                    product.img = img[index]
                    return product
                })
                newArrival.length = 8
                res.render('home', {
                    products: newArrival,
                }) 
            })
            .catch(next)
    }

    
}

module.exports = new SiteController;