import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Payment from '../models/Payment';
import SecurityEvent from '../models/SecurityEvent';

export const getDashboardStats = async () => {
  const now = new Date();

  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    pendingOrders,
    failedPayments,
    lowStockProducts,
    recentEvents,
    salesByMonth,
    ordersByStatus,
    topProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' }, paymentStatus: { $in: ['COMPLETED', 'PENDING'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: 'PENDING' }),
    Payment.countDocuments({ status: 'FAILED' }),
    Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
    SecurityEvent.find().sort({ createdAt: -1 }).limit(20),
    Order.aggregate([
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
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
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
    { label: 'Pending orders', count: pendingOrders, severity: 'MEDIUM' as const },
    { label: 'Failed payments', count: failedPayments, severity: 'HIGH' as const },
    { label: 'Low stock products (<=5)', count: lowStockProducts, severity: 'MEDIUM' as const },
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

export const getSecurityEvents = async (filters: {
  eventType?: string;
  severity?: string;
  page: number;
  limit: number;
}) => {
  const query: any = {};
  if (filters.eventType) query.eventType = filters.eventType;
  if (filters.severity) query.severity = filters.severity;

  const [events, total] = await Promise.all([
    SecurityEvent.find(query)
      .sort({ createdAt: -1 })
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit),
    SecurityEvent.countDocuments(query),
  ]);

  return { events, total, page: filters.page, totalPages: Math.ceil(total / filters.limit) };
};

export const getSecurityEventTypes = async (): Promise<string[]> => {
  return SecurityEvent.distinct('eventType');
};