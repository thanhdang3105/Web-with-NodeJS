const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')
const formidable = require('formidable')
const path = require('path')

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
        const form = new formidable.IncomingForm({multiples: true});
        //Tiến hành parse form
        form.parse(req,function(err,fields,files){
            function setImageProducts(){
                if(files.imageProducts.length){
                    const imageProducts = [...files.imageProducts].map(img =>{
                        return img.originalFilename
                    })
                    return fields.imageProducts = imageProducts
                }
                else{
                    return fields.imageProducts = files.imageProducts.originalFilename
                }
            }
            setImageProducts()
            TypeProducts.find({
                type: fields.type
            })
            .then(type => {
                if (type.length == 0) {
                    const typeProducts = new TypeProducts({
                        type: fields.type,
                        miniType: [fields.miniType]
                    })
                    typeProducts.save(err => {
                        if (err) {
                            res.json(err)
                        } else {
                            next()
                        }
                    })
                    const products = new Products(fields)
                    products.save(err => {
                        if (err) {
                            res.json(err)
                        } else {
                            res.redirect('back')
                        }
                    })
                } else if (type[0].miniType.includes(fields.miniType)) {
                    const products = new Products(fields)
                    products.save(err => {
                        if (err) {
                            res.json(err)
                        } else {
                            res.redirect('back')
                        }
                    })
                } else {
                    const products = new Products(fields)
                    products.save(err => {
                        if (err) {
                            res.json(err)
                        } else {
                            next()
                        }
                    })
                    const newMiniType = [...type[0].miniType, fields.miniType]
                    TypeProducts.updateOne({
                        type: fields.type
                    }, {
                        type: fields.type,
                        miniType: newMiniType
                    })
                    .then(() => {
                        res.redirect('back')
                    })
                    .catch(err => {
                        res.json(err)
                    })

                }
            })
            .catch(err => {
                res.json(err)
            })
        })
        
        form.on('fileBegin',function(name,file){
            const localpath = 'C:\\Users\\Admin\\Desktop\\sản phẩm nodeJS\\src\\public\\img'
            file.filepath = path.join(localpath,'products',file.originalFilename)
        })
    }

}

module.exports = new ProductController;