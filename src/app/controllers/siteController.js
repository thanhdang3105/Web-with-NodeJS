const Products = require('../models/Products')
const {
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')
// const {mutipleMongoosetoObject} = require('../../util/mongoose')

class SiteController {

    //[Get] /
    index(req, res, next) {
        Products.find({})
            .then(products => {
                const img = mutipleMongoosetoObject(products).map(Products => {
                    return Products.imageProducts[0]
                })
                const newArrival = mutipleMongoosetoObject(products).map((product, index) => {
                    if (product.imageProducts.length > 3) {
                        product.imageProducts.length = 3
                    }
                    product.img = img[index]
                    product.datedAt = new Date(Date.now() - product.datedAt).getDate()
                    return product
                })
                const data = newArrival.sort((a,b) => a.datedAt - b.datedAt)
                data.length = 8
                res.render('home', {
                    products: data,
                })
            })
            .catch(next)
    }


}

module.exports = new SiteController;