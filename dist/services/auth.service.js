"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.getCurrentUser = exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
const errorHandler_1 = require("../middleware/errorHandler");
const resetTokens = new Map();
const registerUser = async (input) => {
    const existing = await User_1.default.findOne({ email: input.email.toLowerCase() });
    if (existing) {
        throw new errorHandler_1.AppError('An account with this email already exists', 409, errorHandler_1.AppErrorCode.CONFLICT);
    }
    const user = await User_1.default.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        passwordHash: input.password,
        phone: input.phone || '',
        address: {
            street: input.address?.street || '',
            city: input.address?.city || '',
            state: input.address?.state || '',
            zipCode: input.address?.zipCode || '',
        },
    });
    const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
};
exports.registerUser = registerUser;
const loginUser = async (email, password, req) => {
    const user = await User_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.LOGIN_FAILED,
            req,
            details: { reason: 'unknown email', email: email.toLowerCase() },
            severity: 'MEDIUM',
            statusCode: 401,
        });
        throw new errorHandler_1.AppError('Invalid email or password', 401, errorHandler_1.AppErrorCode.UNAUTHORIZED);
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.LOGIN_FAILED,
            req,
            userId: user.id,
            details: { reason: 'wrong password', email: user.email },
            severity: 'MEDIUM',
            statusCode: 401,
        });
        throw new errorHandler_1.AppError('Invalid email or password', 401, errorHandler_1.AppErrorCode.UNAUTHORIZED);
    }
    if (!user.isActive) {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.ACCOUNT_DISABLED,
            req,
            userId: user.id,
            details: { reason: 'attempted login with disabled account' },
            severity: 'HIGH',
            statusCode: 403,
        });
        throw new errorHandler_1.AppError('This account has been disabled', 403, errorHandler_1.AppErrorCode.FORBIDDEN);
    }
    user.lastLoginAt = new Date();
    await user.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.LOGIN_SUCCESS,
        req,
        userId: user.id,
        details: { email: user.email },
        severity: 'LOW',
        statusCode: 200,
    });
    const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
};
exports.loginUser = loginUser;
const logoutUser = async (userId, req) => {
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.LOGOUT,
        req,
        userId,
        details: {},
        severity: 'LOW',
    });
};
exports.logoutUser = logoutUser;
const requestPasswordReset = async (email, req) => {
    const user = await User_1.default.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new errorHandler_1.AppError('No account found with this email', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000;
    resetTokens.set(hashedToken, { userId: user.id, expiresAt });
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PASSWORD_RESET_REQUEST,
        req,
        userId: user.id,
        details: { email: user.email },
        severity: 'MEDIUM',
    });
    return token;
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword, req) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const entry = resetTokens.get(hashedToken);
    if (!entry || entry.expiresAt < Date.now()) {
        resetTokens.delete(hashedToken);
        throw new errorHandler_1.AppError('Invalid or expired reset token', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(entry.userId);
    if (!user) {
        resetTokens.delete(hashedToken);
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    user.passwordHash = newPassword;
    await user.save();
    resetTokens.delete(hashedToken);
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PASSWORD_CHANGED,
        req,
        userId: user.id,
        details: { reason: 'password reset via token' },
        severity: 'MEDIUM',
    });
};
exports.resetPassword = resetPassword;
const changePassword = async (userId, currentPassword, newPassword, req) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
        await (0, auditLogger_1.createAuditLog)({
            event: SecurityEvent_1.SecurityEventType.PASSWORD_CHANGED,
            req,
            userId,
            details: { success: false, reason: 'incorrect current password' },
            severity: 'MEDIUM',
            statusCode: 400,
        });
        throw new errorHandler_1.AppError('Current password is incorrect', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    user.passwordHash = newPassword;
    await user.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.PASSWORD_CHANGED,
        req,
        userId,
        details: { success: true, reason: 'voluntary password change' },
        severity: 'MEDIUM',
    });
};
exports.changePassword = changePassword;
const getCurrentUser = async (userId) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
const authenticateToken = (token) => {
    const payload = (0, jwt_1.verifyToken)(token);
    return payload;
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.service.js.map