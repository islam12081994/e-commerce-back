import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product id'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').max(99),
});

export const cartItemParamSchema = z.object({
  productId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product id'),
});

export const createOrderSchema = z.object({
  address: z.object({
    firstName: z.string().trim().min(1, 'First name is required').max(60),
    lastName: z.string().trim().min(1, 'Last name is required').max(60),
    street: z.string().trim().min(1, 'Street is required').max(200),
    city: z.string().trim().min(1, 'City is required').max(100),
    zipCode: z.string().trim().min(1, 'Zip code is required').max(20),
    phone: z.string().trim().min(1, 'Phone is required').max(20),
  }),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
});

export const orderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});