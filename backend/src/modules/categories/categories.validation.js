const { z } = require('zod');

const createCategorySchema = z.object({
    body: z.object({
        nameAr: z.string()
          .min(1, 'Arabic name is required')
          .max(255, 'Arabic name must not exceed 255 characters'),
        nameEn: z.string()
          .min(1, 'English name is required')
          .max(255, 'English name must not exceed 255 characters'),
        parentId: z.string().uuid('Invalid parent category ID').optional(),
    }),
});

const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        nameAr: z.string()
          .min(1, 'Arabic name is required')
          .max(255, 'Arabic name must not exceed 255 characters')
          .optional(),
        nameEn: z.string()
          .min(1, 'English name is required')
          .max(255, 'English name must not exceed 255 characters')
          .optional(),
        parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
    }),
});

const idParamSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

module.exports = { createCategorySchema, updateCategorySchema, idParamSchema };