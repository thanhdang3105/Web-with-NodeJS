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
                

                res.render('home', {
                    products: mutipleMongoosetoObject(products).map((a,index) => {
                        a.img = img[index]
                        return a
                    }),
                   
                }) 
               
            })
            .catch(next)
    }

    // [Get] /acount
    acount(req, res, next) {
        res.send('trang quản lý tài khoản')
    }
}

module.exports = new SiteController;