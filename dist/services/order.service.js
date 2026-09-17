"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllOrders = exports.refundOrder = exports.cancelOrderAsAdmin = exports.updateOrderStatus = exports.cancelOrder = exports.getOrderById = exports.getUserOrders = exports.createOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Product_1 = __importDefault(require("../models/Product"));
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
const cart_service_1 = require("./cart.service");
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;
const createOrder = async (userId, input, req) => {
    const cartItems = await (0, cart_service_1.getCartItems)(userId);
    if (cartItems.length === 0) {
        throw new errorHandler_1.AppError('Cart is empty', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    for (const item of cartItems) {
        const product = await Product_1.default.findById(item.productId);
        if (!product) {
            throw new errorHandler_1.AppError(`Product ${item.name} no longer exists`, 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
        }
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const orderItems = [];
        for (const item of cartItems) {
            const product = await Product_1.default.findById(item.productId).session(session);
            if (!product) {
                throw new errorHandler_1.AppError(`Product ${item.name} no longer exists`, 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
            }
            if (product.stock < item.quantity) {
                throw new errorHandler_1.AppError(`Insufficient stock for ${item.name}`, 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
            }
            product.stock -= item.quantity;
            await product.save({ session });
            orderItems.push({
                productId: product.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            });
        }
        const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping;
        const order = await Order_1.default.create([
            {
                userId,
                items: orderItems,
                subtotal,
                shipping,
                total,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                address: input.address,
            },
        ], { session });
        const transactionReference = (0, helpers_1.generateTransactionReference)();
        await Payment_1.default.create([
            {
                orderId: order[0].id,
                userId,
                amount: total,
                method: input.paymentMethod,
                status: 'PENDING',
                transactionReference,
            },
        ], { session });
        await session.commitTransaction();
        session.endSession();
        (0, cart_service_1.commitCartThenClear)(userId);
        return order[0];
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};
exports.createOrder = createOrder;
const getUserOrders = async (userId) => {
    return Order_1.default.find({ userId }).sort({ createdAt: -1 });
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (orderId, userId, isAdmin = false) => {
    if (!(0, helpers_1.isValidObjectId)(orderId)) {
        throw new errorHandler_1.AppError('Invalid order id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        throw new errorHandler_1.AppError('Order not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (!isAdmin && order.userId.toString() !== userId) {
        throw new errorHandler_1.AppError('Order not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    return order;
};
exports.getOrderById = getOrderById;
const cancelOrder = async (orderId, userId, req) => {
    const order = await (0, exports.getOrderById)(orderId, userId);
    if (order.status !== 'PENDING') {
        throw new errorHandler_1.AppError('Only pending orders can be cancelled', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        for (const item of order.items) {
            await Product_1.default.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { session });
        }
        order.status = 'CANCELLED';
        order.paymentStatus = 'REFUNDED';
        await order.save({ session });
        await session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.ORDER_CANCELLED,
        req,
        userId,
        details: { orderId: order.id },
        severity: 'MEDIUM',
    });
    return order;
};
exports.cancelOrder = cancelOrder;
const updateOrderStatus = async (orderId, status, adminUserId, req) => {
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        throw new errorHandler_1.AppError('Order not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (order.status === 'CANCELLED') {
        throw new errorHandler_1.AppError('Cancelled orders cannot be updated', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    order.status = status;
    await order.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.ORDER_UPDATED,
        req,
        userId: adminUserId,
        details: { orderId: order.id, newStatus: status },
        severity: 'LOW',
    });
    return order;
};
exports.updateOrderStatus = updateOrderStatus;
const cancelOrderAsAdmin = async (orderId, adminUserId, req) => {
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        throw new errorHandler_1.AppError('Order not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (order.status === 'CANCELLED') {
        throw new errorHandler_1.AppError('Order is already cancelled', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        for (const item of order.items) {
            await Product_1.default.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { session });
        }
        order.status = 'CANCELLED';
        order.paymentStatus = 'REFUNDED';
        await order.save({ session });
        await session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.ORDER_CANCELLED,
        req,
        userId: adminUserId,
        details: { orderId: order.id, byAdmin: true },
        severity: 'MEDIUM',
    });
    return order;
};
exports.cancelOrderAsAdmin = cancelOrderAsAdmin;
const refundOrder = async (orderId, adminUserId, req) => {
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        throw new errorHandler_1.AppError('Order not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (order.paymentStatus !== 'COMPLETED') {
        throw new errorHandler_1.AppError('Only completed payments can be refunded', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    order.paymentStatus = 'REFUNDED';
    await order.save();
    await Payment_1.default.findOneAndUpdate({ orderId: order.id }, { status: 'REFUNDED' }, { new: true });
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.ORDER_REFUNDED,
        req,
        userId: adminUserId,
        details: { orderId: order.id },
        severity: 'HIGH',
    });
    return order;
};
exports.refundOrder = refundOrder;
const listAllOrders = async (filters) => {
    const query = {};
    if (filters.status)
        query.status = filters.status;
    const [orders, total] = await Promise.all([
        Order_1.default.find(query).sort({ createdAt: -1 }).skip((filters.page - 1) * filters.limit).limit(filters.limit),
        Order_1.default.countDocuments(query),
    ]);
    return { orders, total, page: filters.page, totalPages: Math.ceil(total / filters.limit) };
};
exports.listAllOrders = listAllOrders;
//# sourceMappingURL=order.service.js.map