const { z } = require('zod');

const createCouponSchema = z.object({
  body: z.object({
    code: z.string()
      .min(1, 'Coupon code is required')
      .max(50, 'Coupon code must not exceed 50 characters')
      .regex(/^[A-Z0-9_-]+$/, 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores'),
    discountType: z.enum(['PERCENTAGE', 'FIXED'], { errorMap: () => ({ message: 'Discount type must be PERCENTAGE or FIXED' }) }),
    discountValue: z.number()
      .positive('Discount value must be greater than 0')
      .max(99999, 'Discount value is too high')
      .multipleOf(0.01, 'Discount value must have at most 2 decimal places'),
    minOrderAmount: z.number()
      .min(0, 'Minimum order amount cannot be negative')
      .max(999999, 'Minimum order amount is too high')
      .multipleOf(0.01, 'Minimum order amount must have at most 2 decimal places')
      .optional()
      .default(0),
    maxUses: z.number()
      .int('Max uses must be an integer')
      .min(1, 'Max uses must be at least 1')
      .optional(),
    expiresAt: z.string()
      .datetime('Invalid date format')
      .refine(date => new Date(date) > new Date(), 'Expiration date must be in the future')
      .optional(),
    isActive: z.boolean().optional(),
  }).refine(data => {
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
      return false;
    }
    return true;
  }, {
    message: 'Percentage discount cannot exceed 100',
    path: ['discountValue'],
  }),
});

const updateCouponSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    code: z.string()
      .min(1, 'Coupon code is required')
      .max(50, 'Coupon code must not exceed 50 characters')
      .regex(/^[A-Z0-9_-]+$/, 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores')
      .optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
    discountValue: z.number()
      .positive('Discount value must be greater than 0')
      .max(99999, 'Discount value is too high')
      .multipleOf(0.01, 'Discount value must have at most 2 decimal places')
      .optional(),
    minOrderAmount: z.number()
      .min(0, 'Minimum order amount cannot be negative')
      .max(999999, 'Minimum order amount is too high')
      .multipleOf(0.01, 'Minimum order amount must have at most 2 decimal places')
      .optional(),
    maxUses: z.number()
      .int('Max uses must be an integer')
      .min(1, 'Max uses must be at least 1')
      .nullable()
      .optional(),
    expiresAt: z.string()
      .datetime('Invalid date format')
      .refine(date => new Date(date) > new Date(), 'Expiration date must be in the future')
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

const codeParamSchema = z.object({
  params: z.object({ code: z.string().min(1) }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createCouponSchema, updateCouponSchema, codeParamSchema, idParamSchema };
