import { z } from 'zod';

export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(60).optional(),
    lastName: z.string().trim().min(1).max(60).optional(),
    phone: z.string().trim().max(20).optional(),
    address: z
      .object({
        street: z.string().trim().max(200).optional(),
        city: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
        zipCode: z.string().trim().max(20).optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const changeRoleSchema = z.object({
  role: z.enum(['ADMIN', 'CUSTOMER']),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().trim().max(200).optional(),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
  isActive: z.coerce.boolean().optional(),
});