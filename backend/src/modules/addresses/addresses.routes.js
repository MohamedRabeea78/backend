const { Router } = require('express');
const addressesController = require('./addresses.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { createAddressSchema, updateAddressSchema, idParamSchema } = require('./addresses.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: User addresses management
 */

router.use(authenticate);

/**
 * @swagger
 * /api/v1/addresses:
 *   get:
 *     summary: Get current user's addresses
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', addressesController.getMyAddresses);

/**
 * @swagger
 * /api/v1/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regionId
 *               - addressDetails
 *             properties:
 *               regionId:
 *                 type: integer
 *                 example: 1
 *               addressDetails:
 *                 type: string
 *                 example: شارع التحرير، مبنى 5، شقة 3
 *               isPrimary:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createAddressSchema), addressesController.create);

/**
 * @swagger
 * /api/v1/addresses/{id}:
 *   patch:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               regionId:
 *                 type: integer
 *               addressDetails:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.patch('/:id', validate(updateAddressSchema), addressesController.update);

/**
 * @swagger
 * /api/v1/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete('/:id', validate(idParamSchema), addressesController.remove);

module.exports = router;