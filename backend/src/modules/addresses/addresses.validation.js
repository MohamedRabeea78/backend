const { z } = require('zod');

const createAddressSchema = z.object({
  body: z.object({
    regionId: z.number().int(),
    addressDetails: z.string().min(1),
    isPrimary: z.boolean().optional(),
  }),
});

const updateAddressSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    regionId: z.number().int().optional(),
    addressDetails: z.string().min(1).optional(),
    isPrimary: z.boolean().optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createAddressSchema, updateAddressSchema, idParamSchema };
