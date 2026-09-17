"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeLogData = exports.auditLogger = exports.securityLogger = exports.appLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const logDir = path_1.default.join(__dirname, '../../logs');
const createLogger = (filename) => {
    return (0, pino_1.default)({
        level: config_1.default.logLevel,
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        base: { service: 'ecommerce-siem' },
    }, pino_1.default.transport({
        targets: [
            {
                target: 'pino/file',
                level: 'info',
                options: { destination: path_1.default.join(logDir, filename), mkdir: true },
            },
            {
                target: 'pino/file',
                level: config_1.default.nodeEnv === 'development' ? 'info' : 'error',
                options: { destination: 1 },
            },
        ],
    }));
};
exports.appLogger = createLogger('application.log');
exports.securityLogger = createLogger('security.log');
exports.auditLogger = createLogger('audit.log');
const sanitizeLogData = (data) => {
    const sensitiveFields = ['password', 'passwordHash', 'token', 'cvv', 'creditCard', 'secret'];
    const sanitized = { ...data };
    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }
    return sanitized;
};
exports.sanitizeLogData = sanitizeLogData;
exports.default = exports.appLogger;
//# sourceMappingURL=logger.js.map