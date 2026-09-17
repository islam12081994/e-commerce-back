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
exports.clearCart = exports.removeItem = exports.updateItemQuantity = exports.addItem = exports.getCart = void 0;
const cartService = __importStar(require("../services/cart.service"));
const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json({ success: true, data: cart });
    }
    catch (err) {
        next(err);
    }
};
exports.getCart = getCart;
const addItem = async (req, res, next) => {
    try {
        const cart = await cartService.addItemToCart(req.user.id, req.body.productId, req.body.quantity);
        res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
    }
    catch (err) {
        next(err);
    }
};
exports.addItem = addItem;
const updateItemQuantity = async (req, res, next) => {
    try {
        const cart = await cartService.updateCartItemQuantity(req.user.id, req.params.productId, req.body.quantity);
        res.status(200).json({ success: true, message: 'Cart item updated', data: cart });
    }
    catch (err) {
        next(err);
    }
};
exports.updateItemQuantity = updateItemQuantity;
const removeItem = async (req, res, next) => {
    try {
        const cart = cartService.removeItemFromCart(req.user.id, req.params.productId);
        res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
    }
    catch (err) {
        next(err);
    }
};
exports.removeItem = removeItem;
const clearCart = async (req, res, next) => {
    try {
        const cart = cartService.clearCart(req.user.id);
        res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
    }
    catch (err) {
        next(err);
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cart.controller.js.map