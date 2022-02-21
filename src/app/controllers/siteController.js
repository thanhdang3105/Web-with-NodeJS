// const Course = require('../models/Course')

// const {mutipleMongoosetoObject} = require('../../util/mongoose')

class SiteController {

    //[Get] /
    index(req, res, next) {
        res.render('home')
    }

    // [Get] /acount
    acount(req, res, next) {
        res.send('trang quản lý tài khoản')
    }
}

module.exports = new SiteController;