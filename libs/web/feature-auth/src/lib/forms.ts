import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tenantCode: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().min(1).optional()
  ),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  tenantCode: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});
