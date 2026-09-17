import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config';

export const securityHeaders = helmet({
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
  hsts: config.nodeEnv === 'production' ? { maxAge: 31536000 } : false,
});

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.corsOrigin.split(',').includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);

export const noCache = (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  next();
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    // handled by pino-http in app.ts; this keeps the option for selective env logging
  });
  next();
};