const { Router } = require('express');
const couponsController = require('./coupons.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createCouponSchema, updateCouponSchema, codeParamSchema, idParamSchema } = require('./coupons.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupons management
 */

/**
 * @swagger
 * /api/v1/coupons/code/{code}:
 *   get:
 *     summary: Get coupon by code
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon code
 *         example: SAVE10
 *     responses:
 *       200:
 *         description: Coupon fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coupon not found
 */
router.get('/code/:code', authenticate, validate(codeParamSchema), couponsController.getByCode);

router.use(authenticate, isAdmin);

/**
 * @swagger
 * /api/v1/coupons:
 *   get:
 *     summary: Get all coupons (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Coupons fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', couponsController.getAll);

/**
 * @swagger
 * /api/v1/coupons:
 *   post:
 *     summary: Create a new coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE10
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *                 example: PERCENTAGE
 *               discountValue:
 *                 type: number
 *                 example: 10
 *               minOrderAmount:
 *                 type: number
 *                 example: 200
 *               maxUses:
 *                 type: integer
 *                 example: 100
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', validate(createCouponSchema), couponsController.create);

/**
 * @swagger
 * /api/v1/coupons/{id}:
 *   patch:
 *     summary: Update a coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *               discountValue:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxUses:
 *                 type: integer
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Coupon not found
 */
router.patch('/:id', validate(updateCouponSchema), couponsController.update);

/**
 * @swagger
 * /api/v1/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Coupon not found
 */
router.delete('/:id', validate(idParamSchema), couponsController.remove);

module.exports = router;