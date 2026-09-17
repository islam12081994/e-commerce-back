import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { AuthRequest } from '../middleware/auth';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.listProducts(req.query as any);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body, req.user!.id, req);
    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user!.id, req);
    res.status(200).json({ success: true, message: 'Product updated', data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id, req.user!.id, req);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

export const listCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await productService.listCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};