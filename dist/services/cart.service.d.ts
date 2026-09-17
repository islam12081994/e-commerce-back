export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
}
export interface Cart {
    userId: string;
    items: CartItem[];
}
export declare const getCart: (userId: string) => {
    freeShipping: boolean;
    subtotal: number;
    shipping: number;
    total: number;
    userId: string;
    items: CartItem[];
};
export declare const addItemToCart: (userId: string, productId: string, quantity: number) => Promise<{
    freeShipping: boolean;
    subtotal: number;
    shipping: number;
    total: number;
    userId: string;
    items: CartItem[];
}>;
export declare const updateCartItemQuantity: (userId: string, productId: string, quantity: number) => Promise<{
    freeShipping: boolean;
    subtotal: number;
    shipping: number;
    total: number;
    userId: string;
    items: CartItem[];
}>;
export declare const removeItemFromCart: (userId: string, productId: string) => {
    freeShipping: boolean;
    subtotal: number;
    shipping: number;
    total: number;
    userId: string;
    items: CartItem[];
};
export declare const clearCart: (userId: string) => {
    freeShipping: boolean;
    subtotal: number;
    shipping: number;
    total: number;
    userId: string;
    items: CartItem[];
};
export declare const getCartItems: (userId: string) => Promise<CartItem[]>;
export declare const commitCartThenClear: (userId: string) => CartItem[];
//# sourceMappingURL=cart.service.d.ts.map