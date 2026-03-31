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
    quantity: z.number().int().min(1),
  }),
});

const removeItemSchema = z.object({
  params: z.object({
    variantId: z.string().uuid(),
  }),
});

module.exports = { addItemSchema, updateItemSchema, removeItemSchema };