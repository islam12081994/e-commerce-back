import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder(req.user!.id, req.body, req);
    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user!.id, req);
    res.status(200).json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) {
    next(err);
  }
};

export const getOrderAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id, undefined, true);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const listOrdersAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const result = await orderService.listAllOrders({ status, page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user!.id,
      req
    );
    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (err) {
    next(err);
  }
};

export const cancelOrderAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.cancelOrderAsAdmin(req.params.id, req.user!.id, req);
    res.status(200).json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) {
    next(err);
  }
};

export const refundOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.refundOrder(req.params.id, req.user!.id, req);
    res.status(200).json({ success: true, message: 'Order refunded', data: order });
  } catch (err) {
    next(err);
  }
};