import mongoose, { Document } from 'mongoose';
export declare enum SecurityEventType {
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILED = "LOGIN_FAILED",
    LOGOUT = "LOGOUT",
    PASSWORD_CHANGED = "PASSWORD_CHANGED",
    PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
    ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    FORBIDDEN_ACCESS = "FORBIDDEN_ACCESS",
    INVALID_TOKEN = "INVALID_TOKEN",
    EXPIRED_TOKEN = "EXPIRED_TOKEN",
    SUSPICIOUS_REQUEST = "SUSPICIOUS_REQUEST",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    USER_CREATED = "USER_CREATED",
    USER_UPDATED = "USER_UPDATED",
    USER_DELETED = "USER_DELETED",
    USER_DISABLED = "USER_DISABLED",
    USER_ROLE_CHANGED = "USER_ROLE_CHANGED",
    PRODUCT_CREATED = "PRODUCT_CREATED",
    PRODUCT_UPDATED = "PRODUCT_UPDATED",
    PRODUCT_DELETED = "PRODUCT_DELETED",
    ORDER_UPDATED = "ORDER_UPDATED",
    ORDER_CANCELLED = "ORDER_CANCELLED",
    ORDER_REFUNDED = "ORDER_REFUNDED"
}
export interface ISecurityEvent extends Document {
    eventType: SecurityEventType;
    userId?: mongoose.Types.ObjectId;
    ip: string;
    userAgent: string;
    details: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    createdAt: Date;
}
declare const SecurityEvent: mongoose.Model<ISecurityEvent, {}, {}, {}, mongoose.Document<unknown, {}, ISecurityEvent, {}, {}> & ISecurityEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default SecurityEvent;
//# sourceMappingURL=SecurityEvent.d.ts.map