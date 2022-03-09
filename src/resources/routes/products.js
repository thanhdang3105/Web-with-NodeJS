const express = require('express');
const router = express.Router();

const productController = require('../../app/controllers/productController')

router.delete('/removeCart', productController.removeItemCart)

router.post('/cart', productController.updateCart)

router.get('/:slug',productController.showProducts)

router.post('/addCart/:slug',productController.Cart)

router.get('/',productController.index)

module.exports = router;