"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitCartThenClear = exports.getCartItems = exports.clearCart = exports.removeItemFromCart = exports.updateCartItemQuantity = exports.addItemToCart = exports.getCart = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const errorHandler_1 = require("../middleware/errorHandler");
const carts = new Map();
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;
const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { subtotal, shipping, total: subtotal + shipping };
};
const getCart = (userId) => {
    const cart = carts.get(userId) || { userId, items: [] };
    const totals = calculateTotals(cart.items);
    return { ...cart, ...totals, freeShipping: totals.shipping === 0 };
};
exports.getCart = getCart;
const getOrCreateCart = (userId) => {
    if (!carts.has(userId)) {
        carts.set(userId, { userId, items: [] });
    }
    return carts.get(userId);
};
const addItemToCart = async (userId, productId, quantity) => {
    const product = await Product_1.default.findById(productId);
    if (!product || !product.isActive) {
        throw new errorHandler_1.AppError('Product not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    const cart = getOrCreateCart(userId);
    const existing = cart.items.find((item) => item.productId === productId);
    const requestedQuantity = (existing?.quantity || 0) + quantity;
    if (product.stock < requestedQuantity) {
        throw new errorHandler_1.AppError(`Only ${product.stock} units available in stock`, 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    if (existing) {
        existing.quantity = requestedQuantity;
    }
    else {
        cart.items.push({
            productId,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            stock: product.stock,
        });
    }
    return (0, exports.getCart)(userId);
};
exports.addItemToCart = addItemToCart;
const updateCartItemQuantity = async (userId, productId, quantity) => {
    const cart = getOrCreateCart(userId);
    const existing = cart.items.find((item) => item.productId === productId);
    if (!existing) {
        throw new errorHandler_1.AppError('Item not found in cart', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    const product = await Product_1.default.findById(productId);
    if (product && quantity > product.stock) {
        throw new errorHandler_1.AppError(`Only ${product.stock} units available in stock`, 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    existing.quantity = quantity;
    return (0, exports.getCart)(userId);
};
exports.updateCartItemQuantity = updateCartItemQuantity;
const removeItemFromCart = (userId, productId) => {
    const cart = getOrCreateCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    return (0, exports.getCart)(userId);
};
exports.removeItemFromCart = removeItemFromCart;
const clearCart = (userId) => {
    cartRef(userId).items = [];
    return (0, exports.getCart)(userId);
};
exports.clearCart = clearCart;
const cartRef = (userId) => {
    if (!carts.has(userId)) {
        carts.set(userId, { userId, items: [] });
    }
    return carts.get(userId);
};
const getCartItems = async (userId) => {
    const cart = getOrCreateCart(userId);
    return cart.items;
};
exports.getCartItems = getCartItems;
const commitCartThenClear = (userId) => {
    const cart = carts.get(userId);
    if (!cart)
        return [];
    const items = [...cart.items];
    cart.items = [];
    return items;
};
exports.commitCartThenClear = commitCartThenClear;
//# sourceMappingURL=cart.service.js.map