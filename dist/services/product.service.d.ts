import { IProduct } from '../models/Product';
interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
}
export interface ProductResult {
    products: IProduct[];
    total: number;
    page: number;
    totalPages: number;
}
export declare const listProducts: (filters: ProductFilters) => Promise<ProductResult>;
export declare const getProductById: (id: string) => Promise<IProduct>;
export declare const createProduct: (data: any, adminUserId: string, req?: any) => Promise<IProduct>;
export declare const updateProduct: (id: string, data: any, adminUserId: string, req?: any) => Promise<IProduct>;
export declare const deleteProduct: (id: string, adminUserId: string, req?: any) => Promise<void>;
export declare const listCategories: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Category").ICategory, {}, {}> & import("../models/Category").ICategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
export {};
//# sourceMappingURL=product.service.d.ts.map