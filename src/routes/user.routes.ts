import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validator';
import { updateUserSchema, changeRoleSchema, userQuerySchema } from '../validators/user.validator';
import { objectIdParamSchema } from '../validators/product.validator';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', validateQuery(userQuerySchema), userController.listUsers);
router.get('/:id', validateParams(objectIdParamSchema), userController.getUser);
router.put(
  '/:id',
  validateParams(objectIdParamSchema),
  validateBody(updateUserSchema),
  userController.updateUser
);
router.delete('/:id', validateParams(objectIdParamSchema), userController.deleteUser);
router.put(
  '/:id/role',
  validateParams(objectIdParamSchema),
  validateBody(changeRoleSchema),
  userController.changeRole
);
router.put(
  '/:id/disable',
  validateParams(objectIdParamSchema),
  userController.toggleDisable
);

export default router;