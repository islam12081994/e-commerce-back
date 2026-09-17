"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.controller"));
const orderController = __importStar(require("../controllers/order.controller"));
const auth_1 = require("../middleware/auth");
const validator_1 = require("../middleware/validator");
const order_validator_1 = require("../validators/order.validator");
const product_validator_1 = require("../validators/product.validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, auth_1.requireAdmin);
router.get('/dashboard', adminController.getDashboard);
router.get('/security-events', adminController.getSecurityEvents);
router.get('/security-event-types', adminController.getSecurityEventTypes);
router.get('/orders', orderController.listOrdersAdmin);
router.get('/orders/:id', (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), orderController.getOrderAdmin);
router.put('/orders/:id/status', (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), (0, validator_1.validateBody)(order_validator_1.orderStatusSchema), orderController.updateOrderStatus);
router.post('/orders/:id/cancel', (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), orderController.cancelOrderAdmin);
router.post('/orders/:id/refund', (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), orderController.refundOrder);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map