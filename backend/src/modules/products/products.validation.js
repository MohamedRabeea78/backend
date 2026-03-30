const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    nameAr: z.string().min(1),
    nameEn: z.string().min(1),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    basePrice: z.number().positive(),
    categoryId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    nameAr: z.string().min(1).optional(),
    nameEn: z.string().min(1).optional(),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    basePrice: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
  }),
});

const createVariantSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    sku: z.string().min(1),
    color: z.string().optional(),
    size: z.string().optional(),
    priceModifier: z.number().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    images: z.array(z.object({
      url: z.string().url(),
      isPrimary: z.boolean().optional(),
    })).optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = { createProductSchema, updateProductSchema, createVariantSchema, idParamSchema };