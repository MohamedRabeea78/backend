const { z } = require('zod');

const createAddressSchema = z.object({
  body: z.object({
    regionId: z.number().int().positive('Region ID must be a positive number'),
    addressDetails: z.string()
      .min(5, 'Address must be at least 5 characters')
      .max(500, 'Address must not exceed 500 characters'),
    isPrimary: z.boolean().optional(),
  }),
});

const updateAddressSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    regionId: z.number().int().positive('Region ID must be a positive number').optional(),
    addressDetails: z.string()
      .min(5, 'Address must be at least 5 characters')
      .max(500, 'Address must not exceed 500 characters')
      .optional(),
    isPrimary: z.boolean().optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createAddressSchema, updateAddressSchema, idParamSchema };
