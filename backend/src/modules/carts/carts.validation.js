const { z } = require('zod');

const addItemSchema = z.object({
  body: z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1).default(1),
  }),
});

const updateItemSchema = z.object({
  params: z.object({
    variantId: z.string().uuid(),
  }),
  body: z.object({
    quantity: z.number()
      .int('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1')
      .max(1000, 'Quantity cannot exceed 1000'),
  }),
});

const removeItemSchema = z.object({
  params: z.object({
    variantId: z.string().uuid(),
  }),
});

const mergeCartSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    ).optional().default([]),
  }),
});

module.exports = { addItemSchema, updateItemSchema, removeItemSchema, mergeCartSchema };