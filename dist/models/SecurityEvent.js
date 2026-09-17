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
exports.SecurityEventType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    SecurityEventType["LOGIN_FAILED"] = "LOGIN_FAILED";
    SecurityEventType["LOGOUT"] = "LOGOUT";
    SecurityEventType["PASSWORD_CHANGED"] = "PASSWORD_CHANGED";
    SecurityEventType["PASSWORD_RESET_REQUEST"] = "PASSWORD_RESET_REQUEST";
    SecurityEventType["ACCOUNT_DISABLED"] = "ACCOUNT_DISABLED";
    SecurityEventType["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
    SecurityEventType["FORBIDDEN_ACCESS"] = "FORBIDDEN_ACCESS";
    SecurityEventType["INVALID_TOKEN"] = "INVALID_TOKEN";
    SecurityEventType["EXPIRED_TOKEN"] = "EXPIRED_TOKEN";
    SecurityEventType["SUSPICIOUS_REQUEST"] = "SUSPICIOUS_REQUEST";
    SecurityEventType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    SecurityEventType["USER_CREATED"] = "USER_CREATED";
    SecurityEventType["USER_UPDATED"] = "USER_UPDATED";
    SecurityEventType["USER_DELETED"] = "USER_DELETED";
    SecurityEventType["USER_DISABLED"] = "USER_DISABLED";
    SecurityEventType["USER_ROLE_CHANGED"] = "USER_ROLE_CHANGED";
    SecurityEventType["PRODUCT_CREATED"] = "PRODUCT_CREATED";
    SecurityEventType["PRODUCT_UPDATED"] = "PRODUCT_UPDATED";
    SecurityEventType["PRODUCT_DELETED"] = "PRODUCT_DELETED";
    SecurityEventType["ORDER_UPDATED"] = "ORDER_UPDATED";
    SecurityEventType["ORDER_CANCELLED"] = "ORDER_CANCELLED";
    SecurityEventType["ORDER_REFUNDED"] = "ORDER_REFUNDED";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
const securityEventSchema = new mongoose_1.Schema({
    eventType: { type: String, enum: Object.values(SecurityEventType), required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String, required: true },
    userAgent: { type: String, default: '' },
    details: { type: String, default: '' },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW',
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
securityEventSchema.index({ eventType: 1 });
securityEventSchema.index({ userId: 1 });
securityEventSchema.index({ severity: 1 });
securityEventSchema.index({ createdAt: -1 });
securityEventSchema.index({ ip: 1 });
const SecurityEvent = mongoose_1.default.model('SecurityEvent', securityEventSchema);
exports.default = SecurityEvent;
//# sourceMappingURL=SecurityEvent.js.map