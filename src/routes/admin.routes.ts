import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as orderController from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validator';
import { orderStatusSchema } from '../validators/order.validator';
import { objectIdParamSchema } from '../validators/product.validator';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/security-events', adminController.getSecurityEvents);
router.get('/security-event-types', adminController.getSecurityEventTypes);

router.get('/orders', orderController.listOrdersAdmin);
router.get('/orders/:id', validateParams(objectIdParamSchema), orderController.getOrderAdmin);
router.put(
  '/orders/:id/status',
  validateParams(objectIdParamSchema),
  validateBody(orderStatusSchema),
  orderController.updateOrderStatus
);
router.post(
  '/orders/:id/cancel',
  validateParams(objectIdParamSchema),
  orderController.cancelOrderAdmin
);
router.post(
  '/orders/:id/refund',
  validateParams(objectIdParamSchema),
  orderController.refundOrder
);

export default router;