import { Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.addItemToCart(
      req.user!.id,
      req.body.productId,
      req.body.quantity
    );
    res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
  } catch (err) {
    next(err);
  }
};

export const updateItemQuantity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.updateCartItemQuantity(
      req.user!.id,
      req.params.productId,
      req.body.quantity
    );
    res.status(200).json({ success: true, message: 'Cart item updated', data: cart });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = cartService.removeItemFromCart(req.user!.id, req.params.productId);
    res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = cartService.clearCart(req.user!.id);
    res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
  } catch (err) {
    next(err);
  }
};