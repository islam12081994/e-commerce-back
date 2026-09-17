"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSchema = exports.createOrderSchema = exports.cartItemParamSchema = exports.updateCartItemSchema = exports.addCartItemSchema = void 0;
const zod_1 = require("zod");
exports.addCartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product id'),
    quantity: zod_1.z.coerce.number().int().min(1, 'Quantity must be at least 1').max(99),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.coerce.number().int().min(1, 'Quantity must be at least 1').max(99),
});
exports.cartItemParamSchema = zod_1.z.object({
    productId: zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product id'),
});
exports.createOrderSchema = zod_1.z.object({
    address: zod_1.z.object({
        firstName: zod_1.z.string().trim().min(1, 'First name is required').max(60),
        lastName: zod_1.z.string().trim().min(1, 'Last name is required').max(60),
        street: zod_1.z.string().trim().min(1, 'Street is required').max(200),
        city: zod_1.z.string().trim().min(1, 'City is required').max(100),
        zipCode: zod_1.z.string().trim().min(1, 'Zip code is required').max(20),
        phone: zod_1.z.string().trim().min(1, 'Phone is required').max(20),
    }),
    paymentMethod: zod_1.z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
});
exports.orderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
//# sourceMappingURL=order.validator.js.map