import { z } from 'zod';
export declare const addCartItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
}, {
    productId: string;
    quantity: number;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export declare const cartItemParamSchema: z.ZodObject<{
    productId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: string;
}, {
    productId: string;
}>;
export declare const createOrderSchema: z.ZodObject<{
    address: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        street: z.ZodString;
        city: z.ZodString;
        zipCode: z.ZodString;
        phone: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
        phone: string;
        street: string;
        city: string;
        zipCode: string;
    }, {
        firstName: string;
        lastName: string;
        phone: string;
        street: string;
        city: string;
        zipCode: string;
    }>;
    paymentMethod: z.ZodEnum<["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER"]>;
}, "strip", z.ZodTypeAny, {
    address: {
        firstName: string;
        lastName: string;
        phone: string;
        street: string;
        city: string;
        zipCode: string;
    };
    paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "BANK_TRANSFER";
}, {
    address: {
        firstName: string;
        lastName: string;
        phone: string;
        street: string;
        city: string;
        zipCode: string;
    };
    paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "BANK_TRANSFER";
}>;
export declare const orderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]>;
}, "strip", z.ZodTypeAny, {
    status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}, {
    status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}>;
//# sourceMappingURL=order.validator.d.ts.map