const Products = require('../models/Products')
const Carts = require('../models/Cart')
const TypeProducts = require('../models/TypeProducts')
const User = require('../models/User')
const formidable = require('formidable')
const path = require('path')

const {
    mongoosetoObject,
    mutipleMongoosetoObject,
    setImageProducts
} = require('../../resources/util/mongoose')

class MeController {

    index(req, res, next) {

    }

    cartList(req, res, next) {
        Carts.find({})
            .then(() => {
                res.render('me/cartList')
            })
            .catch(next)
    }

    payment(req, res, next) {
        res.json(req.body)
    }

    listProducts(req, res, next) {
        Products.find({})
            .then(products => {
                res.render('me/listProducts', {
                    products: mutipleMongoosetoObject(products),
                })
            })
    }

    create(req, res, next) {
        TypeProducts.find({})
            .then(type => {
                res.render('me/createProducts', {
                    type: mutipleMongoosetoObject(type)
                })
            })
            .catch(next);
    }

    edit(req, res, next) {
        Promise.all([Products.findById(req.params.id), TypeProducts.find({})])
            .then(([products, types]) => {
                const listType = mutipleMongoosetoObject(types)
                listType.map(type => {
                    if (type.type == products.type) {
                        type.selected = 'selected';
                        type.miniType.map((miniType, index) => {
                            if (miniType == products.miniType) {
                                type.miniTypeIndex = index
                            }
                        })
                    }
                })
                res.render('me/updateProducts', {
                    products: mongoosetoObject(products),
                    type: listType
                })
            })
            .catch(next)
    }

    update(req, res, next) {
        const form = new formidable.IncomingForm({
            multiples: true
        });
        //Tiến hành parse form
        form.parse(req, function (err, fields, files) {
            var imageProducts
            if (setImageProducts(files)) {
                if (Array.isArray(setImageProducts(files))) {
                    imageProducts = [...fields.imageProducts.split(','), ...setImageProducts(files)]
                } else {
                    imageProducts = [...fields.imageProducts.split(','), setImageProducts(files)]
                }
            } else {
                imageProducts = [...fields.imageProducts.split(',')]
            }
            TypeProducts.find({
                    type: fields.type
                })
                .then(type => {
                    fields.imageProducts = imageProducts
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
                        Products.updateOne({
                                _id: req.params.id
                            }, fields)
                            .then(() => {
                                res.redirect('/me/products/list-products')
                            })
                            .catch(next)
                    } else if (type[0].miniType.includes(fields.miniType)) {
                        Products.updateOne({
                                _id: req.params.id
                            }, fields)
                            .then(() => {
                                res.redirect('/me/products/list-products')
                            })
                            .catch(next)
                    } else {
                        Products.updateOne({
                                _id: req.params.id
                            }, fields)
                            .then(() => {
                                res.redirect('/me/products/list-products')
                            })
                            .catch(next)
                        const newMiniType = [...type[0].miniType, fields.miniType]
                        TypeProducts.updateOne({
                                type: fields.type
                            }, {
                                type: fields.type,
                                miniType: newMiniType
                            })
                            .then(() => {
                                res.redirect('/me/products/list-products')
                            })
                            .catch(err => {
                                res.json(err)
                            })
                    }
                })
                .catch(() => {
                    console.log('loi rồi')
                })
        })

        form.on('fileBegin', function (name, file) {
            if (file.originalFilename) {
                const localpath = 'C:\\Users\\Admin\\Desktop\\sản phẩm nodeJS\\src\\public\\img'
                file.filepath = path.join(localpath, 'products', file.originalFilename)
            }
        })
    }

    remove(req, res, next) {
        Products.deleteOne({
                _id: req.params.id,
            })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    removeMany(req, res, next) {
        Products.deleteMany({
                _id: {
                    $in: req.body.productsID
                }
            })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    stored(req, res, next) {
        const form = new formidable.IncomingForm({
            multiples: true
        });
        //Tiến hành parse form
        form.parse(req, function (err, fields, files) {
            fields.imageProducts = setImageProducts(files)
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
                                res.redirect('/me/products/list-products')
                            }
                        })
                    } else if (type[0].miniType.includes(fields.miniType)) {
                        const products = new Products(fields)
                        products.save(err => {
                            if (err) {
                                res.json(err)
                            } else {
                                res.redirect('/me/products/list-products')
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
                                res.redirect('/me/products/list-products')
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

        form.on('fileBegin', function (name, file) {
            const localpath = 'C:\\Users\\Admin\\Desktop\\sản phẩm nodeJS\\src\\public\\img'
            file.filepath = path.join(localpath, 'products', file.originalFilename)
        })
    }

    //[get] /me/user
    login(req, res, next) {
        if(req.query.page){
            req.session.page = req.query.page
        }
            Products.find({})
            .then(products => {
                var form = {
                    form_register: 'disabled',
                }
                if (req.query.register === '') {
                    form = {
                        form_login: 'disabled',
                    }
                }
                res.render('me/login', {
                    form: form
                })
            })
    }

    //[get] /me/user/logout
    logout(req, res, next) {
        req.session.destroy(function (err) {
            if (err) return console.error(err)
            res.redirect('back')
        })
    }

    //[post] /me/checkAccount
    checkAccount(req, res, next) {
        switch (req.query.auth) {
            case 'register':
                User.findOne({
                        accountName: req.body.accountName
                    })
                    .then(user => {
                        if (!user) {
                            const data = new User(req.body)
                            data.save(err => {
                                if (!err) return next()
                                console.log(err)
                            })
                        }
                        res.json(user)
                    })
                    .catch(next)
                break
            case 'login':
                User.findOne({
                        accountName: req.body.accountName,
                        password: req.body.password
                    })
                    .then(user => {
                        res.json(user)
                    })
                    .catch(next)
                break
            case 'password':
                User.findOne({
                        _id: req.session.accountID,
                        password: req.body.password
                    })
                    .then(user => {
                        res.json(user)
                    })
        }
    }

    // [post] /me/acount
    acount(req, res, next) {
        User.findOne({
                accountName: req.body.accountName
            })
            .then(user => {
                if(req.session.page){
                    const page = req.session.page
                    req.session.accountID = user._id;
                    res.redirect(`/products/${page}`)
                }
                else{
                    var session = req.session; //initialize session variable
                    session.accountID = user._id;
                    res.render('me/accountManage', {
                        user: mongoosetoObject(user)
                    })
                }
            })
            .catch(next)
    }

    // [get] /me/account
    accountManage(req, res, next) {
            User.findOne({
                _id: req.session.accountID
            })
            .then(user => {
                res.render('me/accountManage', {
                    user: mongoosetoObject(user)
                })
            })
            .catch(err => console.log(err))
    }

    // [put] /me/user
    updateAccount(req, res, next) {

        var data = {}
        User.findOne({
                _id: req.session.accountID
            })
            .then(user => {
                if (req.body.newAddress) {
                    data = {
                        address: [...user.address, req.body.newAddress],
                        phoneNumber: [...user.phoneNumber, req.body.newPhoneNumber]
                    }
                } else if (req.query.id) {
                    user.address[req.query.id] = req.body.address
                    user.phoneNumber[req.query.id] = req.body.phoneNumber
                    data = mongoosetoObject(user)
                } else {
                    data = req.body
                }
                User.updateOne({
                        _id: user._id
                    }, data)
                    .then(() => {
                        res.redirect('back')
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

    }

    // [delete] /me/user
    deleteAddress(req, res, next) {
        User.findOne({
                _id: req.session.accountID
            })
            .then(user => {
                user.phoneNumber = user.phoneNumber.filter((phone, index) => index !== Number(req.query.id))
                user.address = user.address.filter((address, index) => index !== Number(req.query.id))
                const data = mongoosetoObject(user)
                User.updateOne({
                        _id: user._id
                    }, data)
                    .then(() => {
                        res.redirect('back')
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

}

module.exports = new MeController;