const { z } = require('zod');

const createRegionSchema = z.object({
  body: z.object({
    regionName: z.string().min(1, 'Region name is required').max(255, 'Region name must not exceed 255 characters'),
    shippingFee: z.number()
      .min(0, 'Shipping fee cannot be negative')
      .multipleOf(0.01, 'Shipping fee must have at most 2 decimal places'),
    estimatedDays: z.number()
      .int('Estimated days must be an integer')
      .min(1, 'Estimated days must be at least 1')
      .max(365, 'Estimated days cannot exceed 365'),
  }),
});

const updateRegionSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/, 'ID must be a valid number') }),
  body: z.object({
    regionName: z.string().min(1, 'Region name is required').max(255, 'Region name must not exceed 255 characters').optional(),
    shippingFee: z.number()
      .min(0, 'Shipping fee cannot be negative')
      .multipleOf(0.01, 'Shipping fee must have at most 2 decimal places')
      .optional(),
    estimatedDays: z.number()
      .int('Estimated days must be an integer')
      .min(1, 'Estimated days must be at least 1')
      .max(365, 'Estimated days cannot exceed 365')
      .optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/, 'ID must be a valid number') }),
});

module.exports = { createRegionSchema, updateRegionSchema, idParamSchema };
