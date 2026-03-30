const { z } = require('zod');

const createCategorySchema = z.object({
    body: z.object({
        nameAr: z.string().min(1),
        nameEn: z.string().min(1),
        parentId: z.string().uuid().optional(),
    }),
});

const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        nameAr: z.string().min(1).optional(),
        nameEn: z.string().min(1).optional(),
        parentId: z.string().uuid().nullable().optional(),
    }),
});

const idParamSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

module.exports = { createCategorySchema, updateCategorySchema, idParamSchema };