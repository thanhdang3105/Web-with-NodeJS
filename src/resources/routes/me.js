const express = require('express');
const router = express.Router();

const meController = require('../../app/controllers/meController');

router.get('/products/create', meController.create)

router.get('/products/list-products', meController.listProducts)

router.post('/products', meController.stored)

router.get('/', meController.index)

module.exports = router;