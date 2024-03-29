const express = require('express');
const router = express.Router();

const meController = require('../../app/controllers/meController');


router.get('/products/create', meController.create)

router.get('/products/list-products', meController.listProducts)

router.get('/products/cart-list', meController.cartList)

router.post('/products/cart-list', meController.payment)

router.get('/products/:id/edit', meController.edit)

router.put('/products/:id', meController.update)

router.delete('/products/:id', meController.remove)

router.post('/products/removeMany', meController.removeMany)

router.post('/products', meController.stored)

router.get('/order/:id', meController.showOrder)

router.get('/user/logout', meController.logout)

router.get('/user', meController.login)

router.put('/user', meController.updateAccount)

router.delete('/user', meController.deleteAddress)

router.post('/checkAccount', meController.checkAccount)

router.delete('/account', meController.deleteAccount)

router.delete('/account/:id', meController.removeOrder)

router.put('/account/:id', meController.updateOrder)

router.get('/account', meController.accountManage)

router.get('/', meController.index)

module.exports = router;