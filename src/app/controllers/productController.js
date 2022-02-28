const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const formidable = require('formidable')
const fs = require('fs')

const {
    mutipleMongoosetoObject
} = require('../../resources/util/mongoose')

class ProductController {

    index(req, res, next) {
        res.json(req.body);
    }

    create(req, res, next) {
        TypeProducts.find({})
            .then(type => {
                res.render('products/createProducts', {
                    type: mutipleMongoosetoObject(type)
                })
            })
            .catch(next);
    }

    stored(req, res, next) {
        const form = formidable({
            multiples: true
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            

            res.json(files)
        });
        // TypeProducts.find({
        //         type: req.body.type
        //     })
        //     .then(type => {
        //         if (type.length == 0) {
        //             const typeProducts = new TypeProducts({
        //                 type: req.body.type,
        //                 miniType: [req.body.miniType]
        //             })
        //             typeProducts.save(err => {
        //                 if (err) {
        //                     res.json(err)
        //                 } else {
        //                     next()
        //                 }
        //             })
        //             const products = new Products(req.body)
        //             products.save(err => {
        //                 if (err) {
        //                     res.json(err)
        //                 } else {
        //                     res.redirect('back')
        //                 }
        //             })
        //         } else if (type[0].miniType.includes(req.body.miniType)) {
        //             const products = new Products(req.body)
        //             products.save(err => {
        //                 if (err) {
        //                     res.json(err)
        //                 } else {
        //                     res.redirect('back')
        //                 }
        //             })
        //         } else {
        //             const products = new Products(req.body)
        //             products.save(err => {
        //                 if (err) {
        //                     res.json(err)
        //                 } else {
        //                     next()
        //                 }
        //             })
        //             const newMiniType = [...type[0].miniType, req.body.miniType]
        //             TypeProducts.updateOne({
        //                 type: req.body.type
        //             }, {
        //                 type: req.body.type,
        //                 miniType: newMiniType
        //             })
        //             .then(() => {
        //                 res.redirect('back')
        //             })
        //             .catch(err => {
        //                 res.json(err)
        //             })

        //         }
        //     })
        //     .catch(err => {
        //         res.json(err)
        //     })
    }

}

module.exports = new ProductController;