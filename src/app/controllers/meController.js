const Products = require('../models/Products')
const Carts = require('../models/Cart')
const TypeProducts = require('../models/TypeProducts')
const User = require('../models/User')
const Order = require('../models/Order')
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
    // [get] /me/products/cart-list
    cartList(req, res, next) {
        res.render('me/cartList',{
            itemsCart: res.locals.itemsCart
        })
    }

    //[get] /me/order/:id
    showOrder(req, res, next) {
        Order.findOne({
                _id: req.params.id
            })
            .then(order => {
                const arSlug = order.Products.map(product => {
                    return product.slug.split(' ').join('')
                })
                Products.find({
                        slug: {
                            $in: arSlug
                        }
                    })
                    .then(products => {
                        const data = mongoosetoObject(order)
                        let date = new Date(data.datedAt)
                        data.datedAt = date.getDate() + '/' + (Number(date.getMonth()) + 1) + '/' + date.getFullYear()
                        data.Products.map(product => {
                            products.map(item => {
                                product.slug = product.slug.split(' ').join('')
                                if (product.slug === item.slug) {
                                    product.name = item.name
                                    product.totalPrice = (Number(item.price.split(',').join('')) * Number(product.count)).toLocaleString('en-gb') + 'đ'
                                    product.price = item.price + 'đ'
                                }
                            })
                        })
                        res.render('me/showOrder', {
                            data
                        })
                    })
            })
    }

    // [post] /me/products/cart-list
    payment(req, res, next) {
        req.body.userId = res.locals.user.id
        if (typeof req.body.Products === 'string') {
            req.body.Products = Object.fromEntries(req.body.Products.split(',').map(key => {
                return key.split(':')
            }))
        } else if (typeof req.body.Products === 'object') {
            req.body.Products = req.body.Products.map(product => {
                return Object.fromEntries(product.split(',').map(key => {
                    return key.split(':')
                }))
            })
        }
        const data = new Order(req.body)
        data.save(err => {
            if (err) return console.error(err)
            Carts.deleteMany({
                    userId: req.body.userId
                })
                .then(() => {
                    res.redirect('/me/account')
                })
                .catch(err => console.log(err))
        })
    }

    //[get] /products/list-products
    listProducts(req, res, next) {
        Products.find({})
        .then(products => {
            let data = mutipleMongoosetoObject(products)
            if(req.query.hasOwnProperty('sort')){
                data = data.sort((a,b) => {
                    if(req.query.sort === 'asc'){
                        return Number(a.price.split(',').join('')) - Number(b.price.split(',').join(''))
                    }
                    else{
                        return Number(b.price.split(',').join('')) - Number(a.price.split(',').join(''))
                    }
                })
            }
                res.render('me/listProducts', {
                    products: data,
                })
            })
    }

    create(req, res, next) {
        TypeProducts.find({})
            .then(type => {
                var miniType = type.map(type => type.miniType)
                miniType = miniType.map(mIniType => {
                    return mIniType.map(miniType => {
                        if (miniType.miniType) {
                            return miniType.miniType
                        }
                        return miniType
                    })
                })
                const Type = mutipleMongoosetoObject(type)
                Type.map((type, index) => type.miniType = miniType[index])
                res.render('me/createProducts', {
                    type: Type
                })
            })
            .catch(next);
    }

    edit(req, res, next) {
        Promise.all([Products.findById(req.params.id), TypeProducts.find({})])
            .then(([products, type]) => {
                const Type = mutipleMongoosetoObject(type)
                var miniTypeIndex
                var miniType = type.map(type => type.miniType)
                miniType = miniType.map((mIniType,index) => {
                    return mIniType.map(miniType => {
                        if (miniType.miniType === products.miniType) {
                            miniTypeIndex = index
                        }
                        if (miniType.miniType) {
                            return miniType.miniType
                        }
                        return miniType
                    })
                })
                Type.map((type, index) => {
                    if(type.type === products.type){
                        type.selected = true
                        type.miniTypeIndex = miniTypeIndex
                    }
                    type.miniType = miniType[index]
                })
                res.render('me/updateProducts', {
                    products: mongoosetoObject(products),
                    type: Type
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
                    let testMiniType = false
                    type[0].miniType.map(miniType => {
                        if(miniType.miniType === fields.miniType){
                            testMiniType = true
                        }
                    })
                    if (type.length == 0) {
                        const typeProducts = new TypeProducts({
                            type: fields.type,
                            miniType: [{
                                img: imageProducts[0],
                                miniType: fields.miniType
                            }]
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
                    } else if (testMiniType) {
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
                        const newMiniType = [...type[0].miniType, {
                            img: imageProducts[0],
                            miniType: fields.miniType
                        }]
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
                    let imgMiniType
                    if (typeof fields.imageProducts == 'array') {
                        imgMiniType = fields.imageProducts[0]
                    } else {
                        imgMiniType = fields.imageProducts
                    }
                    let testMiniType = false
                    type[0].miniType.map(miniType => {
                        if(miniType.miniType === fields.miniType){
                            testMiniType = true
                        }
                    })
                    if (type.length == 0) {
                        const typeProducts = new TypeProducts({
                            type: fields.type,
                            miniType: [{
                                miniType: fields.miniType,
                                img: imgMiniType
                            }]
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
                    } else if (testMiniType) {
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
                        const newMiniType = [...type[0].miniType, {
                            miniType: fields.miniType,
                            img: imgMiniType
                        }]
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
        if (!req.session.account && req.query.page) {
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
        var session = req.session; //initialize session variable
        switch (req.query.auth) {
            case 'register':
                if (res.locals.user) {
                    req.body.admin = res.locals.user.admin
                }
                User.findOne({
                        accountName: req.body.accountName
                    })
                    .then(user => {
                        if (!user) {
                            const data = new User(req.body)
                            data.save()
                            session.account = req.body.accountName
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
                        if (user) {
                            session.account = user.accountName
                        }
                        res.json(user)
                    })
                    .catch(next)
                break
            case 'password':
                User.findOne({
                        accountName: req.session.account,
                        password: req.body.password
                    })
                    .then(user => {
                        res.json(user)
                    })
        }
    }

    // [get] /me/account
    accountManage(req, res, next) {
        User.findOne({
                accountName: req.session.account
            })
            .then(user => {
                if (req.session.page) {
                    const page = req.session.page
                    req.session.account = user.accountName;
                    req.session.page = false
                    res.redirect(`/products/${page}`)
                } else {
                    if (user) {
                        if (user.admin) {
                            Promise.all([User.find({}),Order.find({})])
                                .then(([listUsers,order]) => {
                                    const donhang = mutipleMongoosetoObject(order).map(order => {
                                        let date = new Date(order.datedAt)
                                        order.datedAt = date.getDate() + '/' + (Number(date.getMonth()) + 1) + '/' + date.getFullYear()
                                        order.admin = user.admin
                                        return order
                                    })
                                    res.render('me/accountManage', {
                                        user: mongoosetoObject(user),
                                        listUsers: mutipleMongoosetoObject(listUsers),
                                        order: donhang,
                                    })
                                })
                                .catch(err => console.log(err))
                        } else {
                            Order.find({
                                    userId: res.locals.user.id
                                })
                                .then(order => {
                                    const donhang = mutipleMongoosetoObject(order).map(order => {
                                        let date = new Date(order.datedAt)
                                        order.datedAt = date.getDate() + '/' + (Number(date.getMonth()) + 1) + '/' + date.getFullYear()
                                        return order
                                    })
                                    res.render('me/accountManage', {
                                        user: mongoosetoObject(user),
                                        order: donhang,
                                    })
                                })

                        }
                    } else {
                        res.render('me/accountManage')
                    }
                }
            })
            .catch(next)
    }

    // [put] /me/user
    updateAccount(req, res, next) {

        var data = {}
        User.findOne({
                accountName: req.session.account
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
                accountName: req.session.account
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

    //[delete] /me/account
    deleteAccount(req, res, next) {
        User.deleteMany({
                accountName: {
                    $in: req.body.accountName
                }
            })
            .then(() => {
                res.redirect('back')
            })
            .catch(next)
    }

    // [put] /me/account/:id 
    updateOrder(req, res, next) {
        Order.findOne({_id: req.params.id})
        .then(order =>{
            if(order.status === 'Đang đóng hàng'){
                order.status = 'Đã sẵn sàng'
            }
            else if(order.status === 'Đã sẵn sàng'){
                order.status = 'Hoàn thành'
            }
            const data = new Order(order)
            data.save(err =>{
                err ? console.error(err) : res.json({success: order.status})
            })
        })
    }

    // [delete] /me/account/:id 
    removeOrder(req, res, next) {
        Order.deleteOne({_id: req.params.id})
        .then(() => {
            res.json({success: 'Thành công'})
        })
    }
}

module.exports = new MeController;