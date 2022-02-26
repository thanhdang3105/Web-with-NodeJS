const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')

class ProductController {

    index(req, res, next) {
        res.json(req.body);
    }

    create(req, res, next) {
        res.render('./products/createProducts')
    }

    stored(req, res, next) {
        const products = new Products(req.body);
        products.save(err => {
            if (err) return next
            res.redirect('back')
        })
    }

}

module.exports = new ProductController;