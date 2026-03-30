const { Router } = require('express');
const ordersController = require('./orders.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { createOrderSchema } = require('./orders.validation');

const router = Router();

// Ensure all order endpoints are authenticated
router.use(authenticate);

router.post('/', validate(createOrderSchema), ordersController.createOrder);

module.exports = router;
