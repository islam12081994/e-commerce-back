import { z } from 'zod';
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodString;
    stock: z.ZodDefault<z.ZodNumber>;
    image: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    rating: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    isActive: boolean;
    price: number;
    category: string;
    stock: number;
    image: string;
    rating?: number | undefined;
}, {
    name: string;
    description: string;
    price: number;
    category: string;
    isActive?: boolean | undefined;
    stock?: number | undefined;
    image?: string | undefined;
    rating?: number | undefined;
}>;
export declare const productUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    image: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    rating: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    category?: string | undefined;
    stock?: number | undefined;
    image?: string | undefined;
    rating?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    category?: string | undefined;
    stock?: number | undefined;
    image?: string | undefined;
    rating?: number | undefined;
}>;
export declare const productQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    inStock: z.ZodOptional<z.ZodBoolean>;
    sort: z.ZodOptional<z.ZodEnum<["price_asc", "price_desc", "date_desc", "date_asc", "rating_desc"]>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: "price_asc" | "price_desc" | "date_desc" | "date_asc" | "rating_desc" | undefined;
    search?: string | undefined;
    category?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    inStock?: boolean | undefined;
}, {
    sort?: "price_asc" | "price_desc" | "date_desc" | "date_asc" | "rating_desc" | undefined;
    search?: string | undefined;
    limit?: number | undefined;
    category?: string | undefined;
    page?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    inStock?: boolean | undefined;
}>;
export declare const categorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const objectIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=product.validator.d.ts.map