const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(1, 'First name is required')
      .max(100, 'First name must not exceed 100 characters')
      .optional(),
    lastName: z.string()
      .min(1, 'Last name is required')
      .max(100, 'Last name must not exceed 100 characters')
      .optional(),
    phoneNumber: z.string()
      .regex(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
      .optional(),
    birthday: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format')
      .refine(date => new Date(date) < new Date(), 'Birthday cannot be in the future')
      .optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must not exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .refine(pwd => pwd !== 'currentPassword', 'New password must be different from current password'),
  }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { updateProfileSchema, changePasswordSchema, idParamSchema };
