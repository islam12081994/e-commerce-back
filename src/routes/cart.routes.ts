import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validator';
import { addCartItemSchema, updateCartItemSchema, cartItemParamSchema } from '../validators/order.validator';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', validateBody(addCartItemSchema), cartController.addItem);
router.put(
  '/items/:productId',
  validateParams(cartItemParamSchema),
  validateBody(updateCartItemSchema),
  cartController.updateItemQuantity
);
router.delete(
  '/items/:productId',
  validateParams(cartItemParamSchema),
  cartController.removeItem
);
router.delete('/', cartController.clearCart);

export default router;