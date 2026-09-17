"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.noCache = exports.corsMiddleware = exports.corsOptions = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../config"));
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            connectSrc: ["'self'"],
        },
    },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: config_1.default.nodeEnv === 'production' ? { maxAge: 31536000 } : false,
});
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin || config_1.default.corsOrigin.split(',').includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
};
exports.corsMiddleware = (0, cors_1.default)(exports.corsOptions);
const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    next();
};
exports.noCache = noCache;
const requestLogger = (req, res, next) => {
    res.on('finish', () => {
        // handled by pino-http in app.ts; this keeps the option for selective env logging
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=security.js.map