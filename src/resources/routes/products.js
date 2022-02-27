const express = require('express');
const router = express.Router();

const productController = require('../../app/controllers/productController')

router.get('/create',productController.create)

router.post('/',productController.stored)

router.get('/',productController.index)

module.exports = router;