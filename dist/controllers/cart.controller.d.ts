import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getCart: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addItem: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateItemQuantity: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeItem: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const clearCart: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cart.controller.d.ts.map