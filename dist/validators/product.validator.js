"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdParamSchema = exports.categorySchema = exports.productQuerySchema = exports.productUpdateSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Name is required').max(200),
    description: zod_1.z.string().trim().min(1, 'Description is required').max(5000),
    price: zod_1.z.number().min(0.01, 'Price must be greater than 0').max(1000000),
    category: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category id'),
    stock: zod_1.z.number().int().min(0, 'Stock cannot be negative').default(0),
    image: zod_1.z.string().url('Invalid image URL').max(500).optional().default(''),
    rating: zod_1.z.number().min(1).max(5).optional(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.productUpdateSchema = exports.productSchema.partial();
exports.productQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().max(200).optional(),
    category: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category id').optional(),
    minPrice: zod_1.z.coerce.number().min(0).optional(),
    maxPrice: zod_1.z.coerce.number().min(0).optional(),
    inStock: zod_1.z.coerce.boolean().optional(),
    sort: zod_1.z.enum(['price_asc', 'price_desc', 'date_desc', 'date_asc', 'rating_desc']).optional(),
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
});
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().max(500).optional().default(''),
});
exports.objectIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid identifier'),
});
//# sourceMappingURL=product.validator.js.map