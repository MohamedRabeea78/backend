const { z } = require('zod');
const { PAYMENT_METHOD } = require('../../utils/constants');

const createOrderSchema = z.object({
  body: z.object({
    addressId: z
      .string({ required_error: 'Address is required' })
      .uuid('Invalid address ID'),

    paymentMethod: z.enum(Object.values(PAYMENT_METHOD), {
      required_error: 'Payment method is required',
      invalid_type_error: `Payment method must be one of: ${Object.values(PAYMENT_METHOD).join(', ')}`,
    }),

    couponCode: z.string().max(50).optional(),

    pointsToRedeem: z
      .number()
      .int('Points must be a whole number')
      .min(0, 'Points cannot be negative')
      .optional()
      .default(0),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
  body: z.object({
    status: z.enum(
      ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
      { required_error: 'Status is required' }
    ),
    comment: z.string().max(500).optional(),
  }),
});

const getOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    status: z
      .enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
      .optional(),
  }),
});

module.exports = { createOrderSchema, updateOrderStatusSchema, getOrdersSchema };
