const { z } = require('zod');

const adjustPointsSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    amount: z.number().int(),
    reason: z.string().min(1).optional().default('MANUAL_ADJUST'),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { adjustPointsSchema, idParamSchema };
