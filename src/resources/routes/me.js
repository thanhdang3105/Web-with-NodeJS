const express = require('express');
const router = express.Router();

const meController = require('../../app/controllers/meController');

router.get('/products/create', meController.create)

router.get('/products/list-products', meController.listProducts)

router.get('/products/cart-list', meController.cartList)

router.get('/products/:id/edit', meController.edit)

router.put('/products/:id', meController.update)

router.delete('/products/:id', meController.remove)

router.post('/products/removeMany', meController.removeMany)

router.post('/products', meController.stored)

router.get('/', meController.index)

module.exports = router;