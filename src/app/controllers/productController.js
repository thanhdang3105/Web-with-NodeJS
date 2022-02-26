const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')

const { mutipleMongoosetoObject } = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        res.json(req.body);
    }

    create(req, res, next) {
        TypeProducts.find({})
            .then(type => {
                    res.render('products/createProducts',{
                        type: mutipleMongoosetoObject(type)
                    })
            })
            .catch(next);
    }

    stored(req, res, next) {
        TypeProducts.find({
                type: req.body.type
            })
            .then(type => {
                if(type.length !== 0){
                    type.map(type => {
                        // if (type.miniType.includes(req.body.miniType)) {
                        //     const products = new Products(req.body);
                        //     products.save(err => {
                        //         if (err) return next
                        //         res.redirect('back')
                        //     })
                        // } else {
                        //     const newMiniType = [...type.miniType, req.body.miniType]
                        //     const typeProducts = new TypeProducts({
                        //         type: req.body.type,
                        //         miniType: newMiniType
                        //     })
                        //     typeProducts.save(err => {
                        //         if (err) return next
                        //         res.redirect('back')
                        //     })
                        // }
                    })
                }
                else {
                    const typeProducts = new TypeProducts({
                                type: req.body.type,
                                miniType: req.body.miniType
                            })
                            typeProducts.save(err => {
                                if (err) return next
                                next()
                            })
                    const products = new Products(req.body);
                            products.save(err => {
                                if (err) return next
                                res.redirect('back')
                            })
                }
                
            })
            .catch(() => {
                    const products = new Products(req.body);
                    products.save(error => {
                        if (error) return next
                        res.redirect('back')
                    })
                })





    }

}

module.exports = new ProductController;