"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.isValidObjectId = exports.isValidEmail = exports.getClientUserAgent = exports.getClientIp = exports.sanitizeObject = exports.sanitize = exports.generateResetToken = exports.generateTransactionReference = exports.generateOrderNumber = exports.generateId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const generateId = () => (0, uuid_1.v4)();
exports.generateId = generateId;
const generateOrderNumber = () => `ORD-${Date.now()}-${crypto_1.default.randomBytes(3).toString('hex').toUpperCase()}`;
exports.generateOrderNumber = generateOrderNumber;
const generateTransactionReference = () => `TX-${Date.now()}-${crypto_1.default.randomBytes(4).toString('hex').toUpperCase()}`;
exports.generateTransactionReference = generateTransactionReference;
const generateResetToken = () => crypto_1.default.randomBytes(32).toString('hex');
exports.generateResetToken = generateResetToken;
const sanitize = (value) => {
    return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
exports.sanitize = sanitize;
const sanitizeObject = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = typeof value === 'string' ? (0, exports.sanitize)(value) : value;
    }
    return result;
};
exports.sanitizeObject = sanitizeObject;
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
};
exports.getClientIp = getClientIp;
const getClientUserAgent = (req) => {
    return req.headers['user-agent'] || 'unknown';
};
exports.getClientUserAgent = getClientUserAgent;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidObjectId = (id) => {
    return /^[a-fA-F0-9]{24}$/.test(id);
};
exports.isValidObjectId = isValidObjectId;
const getErrorMessage = (err) => {
    if (err instanceof Error)
        return err.message;
    return 'An unknown error occurred';
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=helpers.js.map