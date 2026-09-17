import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validator';
import { createOrderSchema } from '../validators/order.validator';
import { objectIdParamSchema } from '../validators/product.validator';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', validateParams(objectIdParamSchema), orderController.getOrder);
router.post('/:id/cancel', validateParams(objectIdParamSchema), orderController.cancelOrder);

export default router;