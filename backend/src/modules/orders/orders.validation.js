const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'CARD', 'WALLET']),
    couponCode: z.string().optional(),
    pointsToRedeem: z.number().int().min(0).optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    comment: z.string().optional(),
  }),
});

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = { createOrderSchema, updateOrderStatusSchema, idParamSchema };
