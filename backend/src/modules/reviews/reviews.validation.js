const { z } = require('zod');

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    rating: z.number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must not exceed 5'),
    comment: z.string()
      .max(1000, 'Comment must not exceed 1000 characters')
      .optional(),
    reviewImages: z.array(
      z.string().url('Each image must be a valid URL')
    )
      .max(5, 'Maximum 5 images allowed')
      .optional()
      .default([]),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const productIdParamSchema = z.object({
  params: z.object({ productId: z.string().uuid() }),
});

module.exports = { createReviewSchema, idParamSchema, productIdParamSchema };
