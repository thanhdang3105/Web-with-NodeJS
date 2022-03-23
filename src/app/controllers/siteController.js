const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const {
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')
// const {mutipleMongoosetoObject} = require('../../util/mongoose')

class SiteController {

    //[Get] /
    index(req, res, next) {
        Promise.all([Products.find({}),TypeProducts.find({})])
            .then(([products,type]) => {
                var miniType = type.map(type => type.miniType)
                var arr = []
                miniType.map(miniTypeImg => {
                    return miniTypeImg.map(miniType => {
                        arr.push(miniType)
                    })
                })
                // const Type = mutipleMongoosetoObject(type)
                // Type.map((type,index) => type.miniType = miniType[index])
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
                    type: arr
                })
            })
            .catch(next)
    }


}

module.exports = new SiteController;