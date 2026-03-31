const { z } = require('zod');

const createRegionSchema = z.object({
  body: z.object({
    regionName: z.string().min(1),
    shippingFee: z.number().min(0),
    estimatedDays: z.number().int().min(1),
  }),
});

const updateRegionSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    regionName: z.string().min(1).optional(),
    shippingFee: z.number().min(0).optional(),
    estimatedDays: z.number().int().min(1).optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string() }),
});

module.exports = { createRegionSchema, updateRegionSchema, idParamSchema };
