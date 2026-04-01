const { Router } = require('express');
const cartsController = require('./carts.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { addItemSchema, updateItemSchema, removeItemSchema, mergeCartSchema } = require('./carts.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Get current user's cart (requires auth) or guest cart (from guestId)
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: guestId
 *         schema:
 *           type: string
 *         description: Guest ID (optional, for unauthenticated users)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', cartsController.getCart);

/**
 * @swagger
 * /api/v1/carts/items:
 *   post:
 *     summary: Add item to cart (works for authenticated AND guest users)
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: guestId
 *         schema:
 *           type: string
 *         description: Guest ID (required if not authenticated)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Variant not found
 */
router.post('/items', validate(addItemSchema), cartsController.addItem);

router.use(authenticate);

/**
 * @swagger
 * /api/v1/carts/items/{variantId}:
 *   patch:
 *     summary: Update item quantity in cart (authenticated only)
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.patch('/items/:variantId', validate(updateItemSchema), cartsController.updateItem);

/**
 * @swagger
 * /api/v1/carts/items/{variantId}:
 *   delete:
 *     summary: Remove item from cart (authenticated only)
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.delete('/items/:variantId', validate(removeItemSchema), cartsController.removeItem);

/**
 * @swagger
 * /api/v1/carts:
 *   delete:
 *     summary: Clear entire cart (authenticated only)
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/', cartsController.clearCart);

/**
 * @swagger
 * /api/v1/carts/merge:
 *   post:
 *     summary: Merge guest cart items into authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - variantId
 *                     - quantity
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *             example:
 *               items:
 *                 - variantId: "123e4567-e89b-12d3-a456-426614174000"
 *                   quantity: 2
 *     responses:
 *       200:
 *         description: Guest cart merged successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or insufficient stock
 */
router.post('/merge', validate(mergeCartSchema), cartsController.mergeCart);

module.exports = router;