import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(5000),
  price: z.number().min(0.01, 'Price must be greater than 0').max(1000000),
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category id'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  image: z.string().url('Invalid image URL').max(500).optional().default(''),
  rating: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional().default(true),
});

export const productUpdateSchema = productSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category id').optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'date_desc', 'date_asc', 'rating_desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional().default(''),
});

export const objectIdParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid identifier'),
});