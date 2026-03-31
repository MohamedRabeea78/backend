const { Router } = require('express');
const couponsController = require('./coupons.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createCouponSchema, updateCouponSchema, codeParamSchema, idParamSchema } = require('./coupons.validation');

const router = Router();

router.get('/code/:code', authenticate, validate(codeParamSchema), couponsController.getByCode);

router.use(authenticate, isAdmin);
router.get('/', couponsController.getAll);
router.post('/', validate(createCouponSchema), couponsController.create);
router.patch('/:id', validate(updateCouponSchema), couponsController.update);
router.delete('/:id', validate(idParamSchema), couponsController.remove);

module.exports = router;
