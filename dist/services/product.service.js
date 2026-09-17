"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.listProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const errorHandler_1 = require("../middleware/errorHandler");
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
const listProducts = async (filters) => {
    const query = { isActive: true };
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    if (filters.search) {
        query.$text = { $search: filters.search };
    }
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined)
            query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined)
            query.price.$lte = filters.maxPrice;
    }
    if (filters.inStock !== undefined) {
        query.stock = filters.inStock ? { $gt: 0 } : { $eq: 0 };
    }
    let sort = { createdAt: -1 };
    switch (filters.sort) {
        case 'price_asc':
            sort = { price: 1 };
            break;
        case 'price_desc':
            sort = { price: -1 };
            break;
        case 'date_desc':
            sort = { createdAt: -1 };
            break;
        case 'date_asc':
            sort = { createdAt: 1 };
            break;
        case 'rating_desc':
            sort = { rating: -1 };
            break;
    }
    const [products, total] = await Promise.all([
        Product_1.default.find(query).sort(sort).populate('category', 'name slug').skip((page - 1) * limit).limit(limit),
        Product_1.default.countDocuments(query),
    ]);
    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};
exports.listProducts = listProducts;
const getProductById = async (id) => {
    const product = await Product_1.default.findById(id).populate('category', 'name slug');
    if (!product) {
        throw new errorHandler_1.AppError('Product not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    return product;
};
exports.getProductById = getProductById;
const createProduct = async (data, adminUserId, req) => {
    const categoryExists = await Category_1.default.findById(data.category);
    if (!categoryExists) {
        throw new errorHandler_1.AppError('Category not found', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const product = await Product_1.default.create({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: data.image || '',
        rating: data.rating ?? 3,
        isActive: data.isActive ?? true,
    });
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PRODUCT_CREATED,
        req,
        userId: adminUserId,
        details: { productId: product.id, name: product.name },
        severity: 'LOW',
    });
    return product;
};
exports.createProduct = createProduct;
const updateProduct = async (id, data, adminUserId, req) => {
    const product = await Product_1.default.findById(id);
    if (!product) {
        throw new errorHandler_1.AppError('Product not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (data.category) {
        const categoryExists = await Category_1.default.findById(data.category);
        if (!categoryExists) {
            throw new errorHandler_1.AppError('Category not found', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
        }
    }
    Object.assign(product, data);
    await product.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PRODUCT_UPDATED,
        req,
        userId: adminUserId,
        details: { productId: product.id, name: product.name, fieldsUpdated: Object.keys(data) },
        severity: 'LOW',
    });
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id, adminUserId, req) => {
    const product = await Product_1.default.findById(id);
    if (!product) {
        throw new errorHandler_1.AppError('Product not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    await product.deleteOne();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PRODUCT_DELETED,
        req,
        userId: adminUserId,
        details: { productId: id, name: product.name },
        severity: 'MEDIUM',
    });
};
exports.deleteProduct = deleteProduct;
const listCategories = async () => {
    return Category_1.default.find().sort({ name: 1 });
};
exports.listCategories = listCategories;
//# sourceMappingURL=product.service.js.map