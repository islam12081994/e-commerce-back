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
exports.refundOrder = exports.cancelOrderAdmin = exports.updateOrderStatus = exports.listOrdersAdmin = exports.getOrderAdmin = exports.cancelOrder = exports.getOrder = exports.getMyOrders = exports.createOrder = void 0;
const orderService = __importStar(require("../services/order.service"));
const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.user.id, req.body, req);
        res.status(201).json({ success: true, message: 'Order created', data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getUserOrders(req.user.id);
        res.status(200).json({ success: true, data: orders });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyOrders = getMyOrders;
const getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id);
        res.status(200).json({ success: true, data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.getOrder = getOrder;
const cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrder(req.params.id, req.user.id, req);
        res.status(200).json({ success: true, message: 'Order cancelled', data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.cancelOrder = cancelOrder;
const getOrderAdmin = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id, undefined, true);
        res.status(200).json({ success: true, data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.getOrderAdmin = getOrderAdmin;
const listOrdersAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const result = await orderService.listAllOrders({ status, page, limit });
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
exports.listOrdersAdmin = listOrdersAdmin;
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user.id, req);
        res.status(200).json({ success: true, message: 'Order status updated', data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const cancelOrderAdmin = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrderAsAdmin(req.params.id, req.user.id, req);
        res.status(200).json({ success: true, message: 'Order cancelled', data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.cancelOrderAdmin = cancelOrderAdmin;
const refundOrder = async (req, res, next) => {
    try {
        const order = await orderService.refundOrder(req.params.id, req.user.id, req);
        res.status(200).json({ success: true, message: 'Order refunded', data: order });
    }
    catch (err) {
        next(err);
    }
};
exports.refundOrder = refundOrder;
//# sourceMappingURL=order.controller.js.map