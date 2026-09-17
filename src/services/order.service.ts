import mongoose from 'mongoose';
import Order from '../models/Order';
import Payment from '../models/Payment';
import Product from '../models/Product';
import { AppError, AppErrorCode } from '../middleware/errorHandler';
import {
  generateTransactionReference,
  isValidObjectId,
} from '../utils/helpers';
import { getCartItems, commitCartThenClear } from './cart.service';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;

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

export const createOrder = async (userId: string, input: CreateOrderInput, req?: any) => {
  const cartItems = await getCartItems(userId);
  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400, AppErrorCode.BAD_REQUEST);
  }

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new AppError(`Product ${item.name} no longer exists`, 400, AppErrorCode.BAD_REQUEST);
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new AppError(`Product ${item.name} no longer exists`, 400, AppErrorCode.BAD_REQUEST);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.name}`, 400, AppErrorCode.BAD_REQUEST);
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

    const order = await Order.create(
      [
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
      ],
      { session }
    );

    const transactionReference = generateTransactionReference();
    await Payment.create(
      [
        {
          orderId: order[0].id,
          userId,
          amount: total,
          method: input.paymentMethod,
          status: 'PENDING',
          transactionReference,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    commitCartThenClear(userId);

    return order[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getUserOrders = async (userId: string) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string, userId?: string, isAdmin = false) => {
  if (!isValidObjectId(orderId)) {
    throw new AppError('Invalid order id', 400, AppErrorCode.BAD_REQUEST);
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (!isAdmin && order.userId.toString() !== userId) {
    throw new AppError('Order not found', 404, AppErrorCode.NOT_FOUND);
  }
  return order;
};

export const cancelOrder = async (orderId: string, userId: string, req?: any) => {
  const order = await getOrderById(orderId, userId);
  if (order.status !== 'PENDING') {
    throw new AppError('Only pending orders can be cancelled', 400, AppErrorCode.BAD_REQUEST);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }
    order.status = 'CANCELLED';
    order.paymentStatus = 'REFUNDED';
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }

  await createAuditLog({
    event: SecurityEventType.ORDER_CANCELLED,
    req,
    userId,
    details: { orderId: order.id },
    severity: 'MEDIUM',
  });

  return order;
};

export const updateOrderStatus = async (orderId: string, status: string, adminUserId: string, req?: any) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (order.status === 'CANCELLED') {
    throw new AppError('Cancelled orders cannot be updated', 400, AppErrorCode.BAD_REQUEST);
  }
  order.status = status as any;
  await order.save();

  await createAuditLog({
    event: SecurityEventType.ORDER_UPDATED,
    req,
    userId: adminUserId,
    details: { orderId: order.id, newStatus: status },
    severity: 'LOW',
  });

  return order;
};

export const cancelOrderAsAdmin = async (orderId: string, adminUserId: string, req?: any) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (order.status === 'CANCELLED') {
    throw new AppError('Order is already cancelled', 400, AppErrorCode.BAD_REQUEST);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }
    order.status = 'CANCELLED';
    order.paymentStatus = 'REFUNDED';
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }

  await createAuditLog({
    event: SecurityEventType.ORDER_CANCELLED,
    req,
    userId: adminUserId,
    details: { orderId: order.id, byAdmin: true },
    severity: 'MEDIUM',
  });

  return order;
};

export const refundOrder = async (orderId: string, adminUserId: string, req?: any) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (order.paymentStatus !== 'COMPLETED') {
    throw new AppError('Only completed payments can be refunded', 400, AppErrorCode.BAD_REQUEST);
  }

  order.paymentStatus = 'REFUNDED';
  await order.save();

  await Payment.findOneAndUpdate(
    { orderId: order.id },
    { status: 'REFUNDED' },
    { new: true }
  );

  await createAuditLog({
    event: SecurityEventType.ORDER_REFUNDED,
    req,
    userId: adminUserId,
    details: { orderId: order.id },
    severity: 'HIGH',
  });

  return order;
};

export const listAllOrders = async (filters: { status?: string; page: number; limit: number }) => {
  const query: any = {};
  if (filters.status) query.status = filters.status;
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip((filters.page - 1) * filters.limit).limit(filters.limit),
    Order.countDocuments(query),
  ]);
  return { orders, total, page: filters.page, totalPages: Math.ceil(total / filters.limit) };
};