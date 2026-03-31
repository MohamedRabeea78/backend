const { z } = require('zod');

const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(50),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive(),
    minOrderAmount: z.number().min(0).optional().default(0),
    maxUses: z.number().int().min(1).optional(),
    expiresAt: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCouponSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    code: z.string().min(1).max(50).optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
    discountValue: z.number().positive().optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxUses: z.number().int().min(1).nullable().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
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
