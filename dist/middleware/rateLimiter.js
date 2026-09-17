"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = exports.authRateLimiter = exports.loginRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.RATE_LIMIT_EXCEEDED,
            req,
            details: { reason: 'login rate limit exceeded', endpoint: req.originalUrl },
            severity: 'HIGH',
            statusCode: 429,
        });
        res.status(429).json({ message: 'Too many login attempts. Please try again in a minute.' });
    },
    skipSuccessfulRequests: false,
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.RATE_LIMIT_EXCEEDED,
            req,
            details: { reason: 'auth endpoint rate limit exceeded', endpoint: req.originalUrl },
            severity: 'HIGH',
            statusCode: 429,
        });
        res.status(429).json({ message: 'Too many requests. Please try again later.' });
    },
});
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res) => {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.RATE_LIMIT_EXCEEDED,
            req,
            details: { reason: 'api rate limit exceeded', endpoint: req.originalUrl },
            severity: 'HIGH',
            statusCode: 429,
        });
        res.status(429).json({ message: 'Too many requests. Please try again later.' });
    },
});
//# sourceMappingURL=rateLimiter.js.map