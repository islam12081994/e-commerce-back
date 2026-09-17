"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.AppError = exports.AppErrorCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var AppErrorCode;
(function (AppErrorCode) {
    AppErrorCode["VALIDATION"] = "VALIDATION";
    AppErrorCode["NOT_FOUND"] = "NOT_FOUND";
    AppErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    AppErrorCode["FORBIDDEN"] = "FORBIDDEN";
    AppErrorCode["CONFLICT"] = "CONFLICT";
    AppErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    AppErrorCode["INTERNAL"] = "INTERNAL";
    AppErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
})(AppErrorCode || (exports.AppErrorCode = AppErrorCode = {}));
class AppError extends Error {
    constructor(message, statusCode, code = AppErrorCode.BAD_REQUEST) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.AppError = AppError;
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, AppErrorCode.NOT_FOUND));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = async (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let code = err.code || AppErrorCode.INTERNAL;
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        code = AppErrorCode.VALIDATION;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }
    if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        code = AppErrorCode.BAD_REQUEST;
        message = 'Invalid identifier format';
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = AppErrorCode.UNAUTHORIZED;
        message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = AppErrorCode.UNAUTHORIZED;
        message = 'Token expired';
    }
    if (err.code === 11000) {
        statusCode = 409;
        code = AppErrorCode.CONFLICT;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `Value already exists for ${field}`;
    }
    const publicResponse = {
        success: false,
        message,
    };
    if (err.errors && statusCode === 400) {
        publicResponse.errors = err.errors;
    }
    if (statusCode >= 500) {
        // log full error details internally but do not expose to client
        console.error('[InternalError]', { message: err.message, stack: err.stack });
    }
    res.status(statusCode).json(publicResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map