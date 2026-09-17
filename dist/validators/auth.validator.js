"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const emailSchema = zod_1.z.string().email('Invalid email format').max(254);
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number');
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().trim().min(1, 'First name is required').max(60),
    lastName: zod_1.z.string().trim().min(1, 'Last name is required').max(60),
    email: emailSchema,
    password: passwordSchema,
    phone: zod_1.z.string().trim().max(20).optional().default(''),
    address: zod_1.z
        .object({
        street: zod_1.z.string().trim().max(200).optional().default(''),
        city: zod_1.z.string().trim().max(100).optional().default(''),
        state: zod_1.z.string().trim().max(100).optional().default(''),
        zipCode: zod_1.z.string().trim().max(20).optional().default(''),
    })
        .optional(),
});
exports.loginSchema = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string().min(1, 'Password is required').max(128),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: emailSchema,
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    password: passwordSchema,
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});
//# sourceMappingURL=auth.validator.js.map