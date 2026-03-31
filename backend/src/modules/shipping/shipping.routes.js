const { Router } = require('express');
const shippingController = require('./shipping.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createRegionSchema, updateRegionSchema, idParamSchema } = require('./shipping.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping regions management
 */

/**
 * @swagger
 * /api/v1/shipping:
 *   get:
 *     summary: Get all shipping regions
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: Shipping regions fetched successfully
 */
router.get('/', shippingController.getAll);

/**
 * @swagger
 * /api/v1/shipping/{id}:
 *   get:
 *     summary: Get shipping region by ID
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping region ID
 *     responses:
 *       200:
 *         description: Shipping region fetched successfully
 *       404:
 *         description: Shipping region not found
 */
router.get('/:id', validate(idParamSchema), shippingController.getById);

/**
 * @swagger
 * /api/v1/shipping:
 *   post:
 *     summary: Create a new shipping region (Admin only)
 *     tags: [Shipping]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regionName
 *               - shippingFee
 *               - estimatedDays
 *             properties:
 *               regionName:
 *                 type: string
 *                 example: القاهرة
 *               shippingFee:
 *                 type: number
 *                 example: 50
 *               estimatedDays:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Shipping region created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, isAdmin, validate(createRegionSchema), shippingController.create);

/**
 * @swagger
 * /api/v1/shipping/{id}:
 *   patch:
 *     summary: Update a shipping region (Admin only)
 *     tags: [Shipping]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping region ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regionName:
 *                 type: string
 *               shippingFee:
 *                 type: number
 *               estimatedDays:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Shipping region updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shipping region not found
 */
router.patch('/:id', authenticate, isAdmin, validate(updateRegionSchema), shippingController.update);

/**
 * @swagger
 * /api/v1/shipping/{id}:
 *   delete:
 *     summary: Delete a shipping region (Admin only)
 *     tags: [Shipping]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Shipping region ID
 *     responses:
 *       200:
 *         description: Shipping region deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Shipping region not found
 */
router.delete('/:id', authenticate, isAdmin, validate(idParamSchema), shippingController.remove);

module.exports = router;