const { Router } = require('express');
const campaignsController = require('./campaigns.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createCampaignSchema, updateCampaignSchema, idParamSchema } = require('./campaigns.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaigns management
 */

/**
 * @swagger
 * /api/v1/campaigns/active:
 *   get:
 *     summary: Get all active campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Active campaigns fetched successfully
 */
router.get('/active', campaignsController.getActive);

router.use(authenticate, isAdmin);

/**
 * @swagger
 * /api/v1/campaigns:
 *   get:
 *     summary: Get all campaigns (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Campaigns fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', campaignsController.getAll);

/**
 * @swagger
 * /api/v1/campaigns:
 *   post:
 *     summary: Create a new campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - discountPercentage
 *               - scope
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale
 *               bannerUrl:
 *                 type: string
 *                 example: https://example.com/banner.jpg
 *               discountPercentage:
 *                 type: number
 *                 example: 20
 *               scope:
 *                 type: string
 *                 enum: [PRODUCTS, CATEGORY, ALL_ORDERS]
 *                 example: ALL_ORDERS
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: null
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-30
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', validate(createCampaignSchema), campaignsController.create);

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   patch:
 *     summary: Update a campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               bannerUrl:
 *                 type: string
 *               discountPercentage:
 *                 type: number
 *               scope:
 *                 type: string
 *                 enum: [PRODUCTS, CATEGORY, ALL_ORDERS]
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Campaign not found
 */
router.patch('/:id', validate(updateCampaignSchema), campaignsController.update);

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign (Admin only)
 *     tags: [Campaigns]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Campaign not found
 */
router.delete('/:id', validate(idParamSchema), campaignsController.remove);

module.exports = router;