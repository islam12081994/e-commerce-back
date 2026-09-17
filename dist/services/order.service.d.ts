import mongoose from 'mongoose';
interface CreateOrderInput {
    address: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        zipCode: string;
        phone: string;
    };
    paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
}
export declare const createOrder: (userId: string, input: CreateOrderInput, req?: any) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const getUserOrders: (userId: string) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const getOrderById: (orderId: string, userId?: string, isAdmin?: boolean) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const cancelOrder: (orderId: string, userId: string, req?: any) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const updateOrderStatus: (orderId: string, status: string, adminUserId: string, req?: any) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const cancelOrderAsAdmin: (orderId: string, adminUserId: string, req?: any) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const refundOrder: (orderId: string, adminUserId: string, req?: any) => Promise<mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const listAllOrders: (filters: {
    status?: string;
    page: number;
    limit: number;
}) => Promise<{
    orders: (mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    totalPages: number;
}>;
export {};
//# sourceMappingURL=order.service.d.ts.map