const { Router } = require('express');
const loyaltyController = require('./loyalty.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { adjustPointsSchema } = require('./loyalty.validation');

const router = Router();

router.use(authenticate);

router.get('/balance', loyaltyController.getBalance);
router.get('/transactions', loyaltyController.getTransactions);
router.post('/adjust', isAdmin, validate(adjustPointsSchema), loyaltyController.adjustPoints);

module.exports = router;