const express = require('express');
const router = express.Router();

const productController = require('../../app/controllers/productController')

router.get('/:slug',productController.showProducts)

router.post('/',productController.index)

router.get('/',productController.index)

module.exports = router;