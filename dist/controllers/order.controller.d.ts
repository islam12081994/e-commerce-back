import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyOrders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrderAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const listOrdersAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelOrderAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const refundOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map