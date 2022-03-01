const Products = require('../models/Products')
const TypeProducts = require('../models/TypeProducts')

class ProductController {

    index(req, res, next) {
        res.json(req.body);
    }

}

module.exports = new ProductController;