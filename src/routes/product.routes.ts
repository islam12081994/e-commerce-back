import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validator';
import {
  productSchema,
  productUpdateSchema,
  productQuerySchema,
  objectIdParamSchema,
} from '../validators/product.validator';

const router = Router();

router.get('/', validateQuery(productQuerySchema), productController.listProducts);
router.get('/categories', productController.listCategories);
router.get('/:id', validateParams(objectIdParamSchema), productController.getProduct);
router.post('/', authenticate, requireAdmin, validateBody(productSchema), productController.createProduct);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(objectIdParamSchema),
  validateBody(productUpdateSchema),
  productController.updateProduct
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validateParams(objectIdParamSchema),
  productController.deleteProduct
);

export default router;