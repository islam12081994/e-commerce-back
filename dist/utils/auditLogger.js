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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = void 0;
const logger_1 = require("./logger");
const helpers_1 = require("./helpers");
const SecurityEvent_1 = __importStar(require("../models/SecurityEvent"));
const mongoose_1 = __importDefault(require("mongoose"));
const severityMap = {
    [SecurityEvent_1.SecurityEventType.LOGIN_SUCCESS]: 'LOW',
    [SecurityEvent_1.SecurityEventType.LOGIN_FAILED]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.LOGOUT]: 'LOW',
    [SecurityEvent_1.SecurityEventType.PASSWORD_CHANGED]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.PASSWORD_RESET_REQUEST]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.ACCOUNT_DISABLED]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.UNAUTHORIZED_ACCESS]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.FORBIDDEN_ACCESS]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.INVALID_TOKEN]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.EXPIRED_TOKEN]: 'LOW',
    [SecurityEvent_1.SecurityEventType.SUSPICIOUS_REQUEST]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.RATE_LIMIT_EXCEEDED]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.USER_CREATED]: 'LOW',
    [SecurityEvent_1.SecurityEventType.USER_UPDATED]: 'LOW',
    [SecurityEvent_1.SecurityEventType.USER_DELETED]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.USER_DISABLED]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.USER_ROLE_CHANGED]: 'HIGH',
    [SecurityEvent_1.SecurityEventType.PRODUCT_CREATED]: 'LOW',
    [SecurityEvent_1.SecurityEventType.PRODUCT_UPDATED]: 'LOW',
    [SecurityEvent_1.SecurityEventType.PRODUCT_DELETED]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.ORDER_UPDATED]: 'LOW',
    [SecurityEvent_1.SecurityEventType.ORDER_CANCELLED]: 'MEDIUM',
    [SecurityEvent_1.SecurityEventType.ORDER_REFUNDED]: 'HIGH',
};
const createAuditLog = async (params) => {
    const { event, userId, req, details = {}, severity, statusCode, } = params;
    const ip = req ? (0, helpers_1.getClientIp)(req) : 'system';
    const userAgent = req ? (0, helpers_1.getClientUserAgent)(req) : 'system';
    const effectiveSeverity = severity || severityMap[event] || 'LOW';
    const enrichedDetails = {
        event,
        userId: userId || null,
        IP: ip,
        userAgent,
        method: req?.method || null,
        path: req?.originalUrl || req?.url || null,
        statusCode: statusCode || null,
        severity: effectiveSeverity,
        ...(0, logger_1.sanitizeLogData)(details),
    };
    logger_1.securityLogger.info(enrichedDetails, `[${event}] ${JSON.stringify(enrichedDetails)}`);
    logger_1.auditLogger.info(enrichedDetails, `[${event}] ${JSON.stringify(enrichedDetails)}`);
    try {
        await SecurityEvent_1.default.create({
            eventType: event,
            userId: userId && mongoose_1.default.isValidObjectId(userId) ? userId : undefined,
            ip,
            userAgent,
            details: JSON.stringify((0, logger_1.sanitizeLogData)(details)),
            severity: effectiveSeverity,
        });
    }
    catch (err) {
        logger_1.securityLogger.error({ event, err: err.message }, 'Failed to persist security event');
    }
};
exports.createAuditLog = createAuditLog;
//# sourceMappingURL=auditLogger.js.map