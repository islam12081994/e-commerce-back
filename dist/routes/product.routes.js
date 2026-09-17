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
const productController = __importStar(require("../controllers/product.controller"));
const auth_1 = require("../middleware/auth");
const validator_1 = require("../middleware/validator");
const product_validator_1 = require("../validators/product.validator");
const router = (0, express_1.Router)();
router.get('/', (0, validator_1.validateQuery)(product_validator_1.productQuerySchema), productController.listProducts);
router.get('/categories', productController.listCategories);
router.get('/:id', (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), productController.getProduct);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (0, validator_1.validateBody)(product_validator_1.productSchema), productController.createProduct);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), (0, validator_1.validateBody)(product_validator_1.productUpdateSchema), productController.updateProduct);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, (0, validator_1.validateParams)(product_validator_1.objectIdParamSchema), productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map