const { z } = require('zod');

const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    discountPercentage: z.number().min(0).max(100),
    scope: z.enum(['PRODUCTS', 'CATEGORY', 'ALL_ORDERS']),
    categoryId: z.string().uuid().nullable().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    isActive: z.boolean().optional(),
    productIds: z.array(z.string().uuid()).optional(),
  }),
});

const updateCampaignSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
    scope: z.enum(['PRODUCTS', 'CATEGORY', 'ALL_ORDERS']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createCampaignSchema, updateCampaignSchema, idParamSchema };
