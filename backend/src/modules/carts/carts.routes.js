const { Router } = require('express');
const cartsController = require('./carts.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { addItemSchema, updateItemSchema, removeItemSchema } = require('./carts.validation');

const router = Router();

router.use(authenticate);

router.get('/', cartsController.getCart);
router.post('/items', validate(addItemSchema), cartsController.addItem);
router.patch('/items/:variantId', validate(updateItemSchema), cartsController.updateItem);
router.delete('/items/:variantId', validate(removeItemSchema), cartsController.removeItem);
router.delete('/', cartsController.clearCart);

module.exports = router;