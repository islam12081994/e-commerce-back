"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.changeRoleSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().trim().min(1).max(60).optional(),
    lastName: zod_1.z.string().trim().min(1).max(60).optional(),
    phone: zod_1.z.string().trim().max(20).optional(),
    address: zod_1.z
        .object({
        street: zod_1.z.string().trim().max(200).optional(),
        city: zod_1.z.string().trim().max(100).optional(),
        state: zod_1.z.string().trim().max(100).optional(),
        zipCode: zod_1.z.string().trim().max(20).optional(),
    })
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});
exports.changeRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN', 'CUSTOMER']),
});
exports.userQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
    search: zod_1.z.string().trim().max(200).optional(),
    role: zod_1.z.enum(['ADMIN', 'CUSTOMER']).optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
//# sourceMappingURL=user.validator.js.map