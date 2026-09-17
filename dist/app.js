"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopServer = exports.startServer = exports.connectDB = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const pino_http_1 = __importDefault(require("pino-http"));
const security_1 = require("./middleware/security");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./utils/logger"));
const helpers_1 = require("./utils/helpers");
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use(security_1.securityHeaders);
app.use(security_1.corsMiddleware);
app.use(security_1.noCache);
app.use((0, pino_http_1.default)({
    logger: logger_1.default,
    genReqId: () => `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            ip: (0, helpers_1.getClientIp)(req),
            userAgent: req.headers['user-agent'],
        }),
        res: (res) => ({
            statusCode: res.statusCode,
            responseTime: res.responseTime,
        }),
    },
    customLogLevel: (req, res) => {
        if (res.statusCode >= 500)
            return 'error';
        if (res.statusCode >= 400)
            return 'warn';
        return 'info';
    },
    redact: {
        paths: [
            'req.headers.authorization',
            'req.body.password',
            'req.body.currentPassword',
            'req.body.newPassword',
            'req.body.token',
            'res.headers["set-cookie"]',
        ],
        censor: '[REDACTED]',
    },
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', rateLimiter_1.apiRateLimiter);
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.json({ name: 'E-Commerce SIEM Backend', status: 'running', docs: '/api/health' });
});
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
let server = null;
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.mongodbUri);
        logger_1.default.info({ message: 'Connected to MongoDB', uri: config_1.default.mongodbUri.split('@').pop() });
    }
    catch (err) {
        logger_1.default.error({ err: err.message }, 'MongoDB connection failed');
        throw err;
    }
};
exports.connectDB = connectDB;
const startServer = async () => {
    await (0, exports.connectDB)();
    server = app.listen(config_1.default.port, () => {
        logger_1.default.info({
            message: `Server started`,
            port: config_1.default.port,
            env: config_1.default.nodeEnv,
        });
    });
};
exports.startServer = startServer;
const stopServer = async () => {
    if (server) {
        await new Promise((resolve) => server.close(() => resolve()));
    }
    await mongoose_1.default.disconnect();
};
exports.stopServer = stopServer;
if (require.main === module) {
    (0, exports.startServer)().catch((err) => {
        logger_1.default.error({ err: err.message }, 'Failed to start server');
        process.exit(1);
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map