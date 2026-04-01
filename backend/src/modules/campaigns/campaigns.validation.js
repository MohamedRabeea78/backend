const { z } = require('zod');

const createCampaignSchema = z.object({
  body: z.object({
    title: z.string()
      .min(1, 'Campaign title is required')
      .max(255, 'Campaign title must not exceed 255 characters'),
    discountPercentage: z.number()
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot exceed 100%'),
    scope: z.enum(['PRODUCTS', 'CATEGORY', 'ALL_ORDERS']),
    categoryId: z.string().uuid('Invalid category ID').nullable().optional(),
    startDate: z.string()
      .datetime('Invalid start date format')
      .refine(date => new Date(date) > new Date(), 'Start date must be in the future'),
    endDate: z.string()
      .datetime('Invalid end date format'),
    isActive: z.boolean().optional(),
    productIds: z.array(z.string().uuid('Invalid product ID')).optional(),
  }).refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    { message: 'End date must be after start date', path: ['endDate'] }
  ),
});

const updateCampaignSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string()
      .min(1, 'Campaign title is required')
      .max(255, 'Campaign title must not exceed 255 characters')
      .optional(),
    discountPercentage: z.number()
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot exceed 100%')
      .optional(),
    scope: z.enum(['PRODUCTS', 'CATEGORY', 'ALL_ORDERS']).optional(),
    startDate: z.string()
      .datetime('Invalid start date format')
      .optional(),
    endDate: z.string()
      .datetime('Invalid end date format')
      .optional(),
    isActive: z.boolean().optional(),
    productIds: z.array(z.string().uuid('Invalid product ID')).optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createCampaignSchema, updateCampaignSchema, idParamSchema };
