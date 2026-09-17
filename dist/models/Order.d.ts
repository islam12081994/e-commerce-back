import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    items: Array<{
        productId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    address: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        zipCode: string;
        phone: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map