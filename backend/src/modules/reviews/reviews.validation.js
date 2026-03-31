const { z } = require('zod');

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
    reviewImages: z.array(z.string().url()).optional().default([]),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const productIdParamSchema = z.object({
  params: z.object({ productId: z.string().uuid() }),
});

module.exports = { createReviewSchema, idParamSchema, productIdParamSchema };
