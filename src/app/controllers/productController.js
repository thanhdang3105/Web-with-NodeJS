

class ProductController {

    index(req, res, next) {
        res.send('Trang sản phẩm')
    }

}

module.exports = new ProductController;