"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../utils/helpers");
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const ip = (0, helpers_1.getClientIp)(req);
            await (0, auditLogger_1.createAuditLog)({
                event: SecurityEvent_1.SecurityEventType.UNAUTHORIZED_ACCESS,
                req,
                details: { reason: 'missing token' },
                severity: 'HIGH',
                statusCode: 401,
            });
            void ip;
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        }
        catch (err) {
            const eventType = err.name === 'TokenExpiredError'
                ? SecurityEvent_1.SecurityEventType.EXPIRED_TOKEN
                : SecurityEvent_1.SecurityEventType.INVALID_TOKEN;
            await (0, auditLogger_1.createAuditLog)({
                event: eventType,
                req,
                details: { reason: err.name === 'TokenExpiredError' ? 'token expired' : 'invalid token' },
                severity: eventType === SecurityEvent_1.SecurityEventType.EXPIRED_TOKEN ? 'LOW' : 'MEDIUM',
                statusCode: 401,
            });
            return res.status(401).json({ message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
        }
        const user = await User_1.default.findById(payload.userId);
        if (!user || !user.isActive) {
            await (0, auditLogger_1.createAuditLog)({
                event: SecurityEvent_1.SecurityEventType.UNAUTHORIZED_ACCESS,
                req,
                userId: payload.userId,
                details: { reason: !user ? 'user not found' : 'user disabled' },
                severity: 'HIGH',
                statusCode: 401,
            });
            return res.status(401).json({ message: 'User not found or disabled' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const requireAdmin = async (req, res, next) => {
    if (!req.user) {
        const ip = (0, helpers_1.getClientIp)(req);
        void ip;
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'ADMIN') {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.FORBIDDEN_ACCESS,
            req,
            userId: req.user.id,
            details: { reason: 'admin role required', attemptedBy: (0, helpers_1.getClientUserAgent)(req) },
            severity: 'HIGH',
            statusCode: 403,
        });
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map