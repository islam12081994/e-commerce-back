"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityEventTypes = exports.getSecurityEvents = exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const Payment_1 = __importDefault(require("../models/Payment"));
const SecurityEvent_1 = __importDefault(require("../models/SecurityEvent"));
const getDashboardStats = async () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const [totalUsers, totalProducts, totalOrders, revenueResult, pendingOrders, failedPayments, lowStockProducts, recentEvents, salesByMonth, ordersByStatus, topProducts,] = await Promise.all([
        User_1.default.countDocuments(),
        Product_1.default.countDocuments(),
        Order_1.default.countDocuments(),
        Order_1.default.aggregate([
            { $match: { status: { $ne: 'CANCELLED' }, paymentStatus: { $in: ['COMPLETED', 'PENDING'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
        ]),
        Order_1.default.countDocuments({ status: 'PENDING' }),
        Payment_1.default.countDocuments({ status: 'FAILED' }),
        Product_1.default.countDocuments({ stock: { $lte: 5 }, isActive: true }),
        SecurityEvent_1.default.find().sort({ createdAt: -1 }).limit(20),
        Order_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $ne: 'CANCELLED' },
                    paymentStatus: { $in: ['COMPLETED', 'PENDING'] },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        Order_1.default.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        Order_1.default.aggregate([
            { $match: { status: { $ne: 'CANCELLED' }, paymentStatus: { $in: ['COMPLETED', 'PENDING'] } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    image: { $first: '$items.image' },
                    unitsSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
        ]),
    ]);
    const needsAttention = [
        { label: 'Pending orders', count: pendingOrders, severity: 'MEDIUM' },
        { label: 'Failed payments', count: failedPayments, severity: 'HIGH' },
        { label: 'Low stock products (<=5)', count: lowStockProducts, severity: 'MEDIUM' },
    ];
    return {
        totals: {
            users: totalUsers,
            products: totalProducts,
            orders: totalOrders,
            revenue: revenueResult.length ? revenueResult[0].totalRevenue : 0,
        },
        needsAttention,
        recentSecurityEvents: recentEvents,
        salesByMonth,
        ordersByStatus,
        topProducts,
        generatedAt: new Date().toISOString(),
    };
};
exports.getDashboardStats = getDashboardStats;
const getSecurityEvents = async (filters) => {
    const query = {};
    if (filters.eventType)
        query.eventType = filters.eventType;
    if (filters.severity)
        query.severity = filters.severity;
    const [events, total] = await Promise.all([
        SecurityEvent_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((filters.page - 1) * filters.limit)
            .limit(filters.limit),
        SecurityEvent_1.default.countDocuments(query),
    ]);
    return { events, total, page: filters.page, totalPages: Math.ceil(total / filters.limit) };
};
exports.getSecurityEvents = getSecurityEvents;
const getSecurityEventTypes = async () => {
    return SecurityEvent_1.default.distinct('eventType');
};
exports.getSecurityEventTypes = getSecurityEventTypes;
//# sourceMappingURL=admin.service.js.map