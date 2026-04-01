const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    nameAr: z.string()
      .min(1, 'Arabic name is required')
      .max(255, 'Arabic name must not exceed 255 characters'),
    nameEn: z.string()
      .min(1, 'English name is required')
      .max(255, 'English name must not exceed 255 characters'),
    descriptionAr: z.string().max(5000, 'Arabic description must not exceed 5000 characters').optional(),
    descriptionEn: z.string().max(5000, 'English description must not exceed 5000 characters').optional(),
    basePrice: z.number()
      .positive('Price must be greater than 0')
      .max(999999, 'Price is too high')
      .multipleOf(0.01, 'Price must have at most 2 decimal places'),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
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
    descriptionAr: z.string().max(5000, 'Arabic description must not exceed 5000 characters').optional(),
    descriptionEn: z.string().max(5000, 'English description must not exceed 5000 characters').optional(),
    basePrice: z.number()
      .positive('Price must be greater than 0')
      .max(999999, 'Price is too high')
      .multipleOf(0.01, 'Price must have at most 2 decimal places')
      .optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    isActive: z.boolean().optional(),
  }),
});

const createVariantSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    sku: z.string()
      .min(1, 'SKU is required')
      .max(100, 'SKU must not exceed 100 characters'),
    color: z.string()
      .max(100, 'Color must not exceed 100 characters')
      .optional(),
    size: z.string()
      .max(50, 'Size must not exceed 50 characters')
      .optional(),
    priceModifier: z.number()
      .max(999999, 'Price modifier is too high')
      .multipleOf(0.01, 'Price modifier must have at most 2 decimal places')
      .optional(),
    stockQuantity: z.number()
      .int('Stock quantity must be an integer')
      .min(0, 'Stock quantity cannot be negative')
      .optional(),
    images: z.array(z.object({
      url: z.string().url('Invalid image URL'),
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