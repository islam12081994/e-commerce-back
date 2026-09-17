import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import pinoHttp from 'pino-http';
import { securityHeaders, corsMiddleware, noCache } from './middleware/security';
import { apiRateLimiter } from './middleware/rateLimiter';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import routes from './routes';
import config from './config';
import appLogger from './utils/logger';
import { getClientIp } from './utils/helpers';

const app: Application = express();

app.disable('x-powered-by');

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(noCache);

app.use(
  pinoHttp({
    logger: appLogger,
    genReqId: () => `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        ip: getClientIp(req),
        userAgent: req.headers['user-agent'],
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        responseTime: res.responseTime,
      }),
    },
    customLogLevel: (req, res) => {
      if (res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
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
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api', apiRateLimiter);
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ name: 'E-Commerce SIEM Backend', status: 'running', docs: '/api/health' });
});

app.use(notFoundHandler);
app.use(errorHandler);

let server: ReturnType<typeof app.listen> | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    appLogger.info({ message: 'Connected to MongoDB', uri: config.mongodbUri.split('@').pop() });
  } catch (err) {
    appLogger.error({ err: (err as Error).message }, 'MongoDB connection failed');
    throw err;
  }
};

export const startServer = async (): Promise<void> => {
  await connectDB();
  server = app.listen(config.port, () => {
    appLogger.info({
      message: `Server started`,
      port: config.port,
      env: config.nodeEnv,
    });
  });
};

export const stopServer = async (): Promise<void> => {
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
  await mongoose.disconnect();
};

if (require.main === module) {
  startServer().catch((err) => {
    appLogger.error({ err: (err as Error).message }, 'Failed to start server');
    process.exit(1);
  });
}

export default app;