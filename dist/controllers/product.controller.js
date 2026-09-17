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
exports.listCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const productService = __importStar(require("../services/product.service"));
const listProducts = async (req, res, next) => {
    try {
        const result = await productService.listProducts(req.query);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
exports.listProducts = listProducts;
const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    }
    catch (err) {
        next(err);
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body, req.user.id, req);
        res.status(201).json({ success: true, message: 'Product created', data: product });
    }
    catch (err) {
        next(err);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body, req.user.id, req);
        res.status(200).json({ success: true, message: 'Product updated', data: product });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id, req.user.id, req);
        res.status(200).json({ success: true, message: 'Product deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
const listCategories = async (req, res, next) => {
    try {
        const categories = await productService.listCategories();
        res.status(200).json({ success: true, data: categories });
    }
    catch (err) {
        next(err);
    }
};
exports.listCategories = listCategories;
//# sourceMappingURL=product.controller.js.map