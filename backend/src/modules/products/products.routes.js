const { Router } = require('express');
const productsController = require('./products.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createProductSchema, updateProductSchema, createVariantSchema, idParamSchema } = require('./products.validation');

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products fetched successfully
 */
router.get('/', productsController.getAll);
router.get('/:id', validate(idParamSchema), productsController.getById);

router.post('/', authenticate, isAdmin, validate(createProductSchema), productsController.create);
router.patch('/:id', authenticate, isAdmin, validate(updateProductSchema), productsController.update);
router.delete('/:id', authenticate, isAdmin, validate(idParamSchema), productsController.remove);

// Variants
router.post('/:id/variants', authenticate, isAdmin, validate(createVariantSchema), productsController.createVariant);

module.exports = router;