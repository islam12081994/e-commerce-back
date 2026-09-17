import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    await createAuditLog({
      event: SecurityEventType.RATE_LIMIT_EXCEEDED,
      req,
      details: { reason: 'login rate limit exceeded', endpoint: req.originalUrl },
      severity: 'HIGH',
      statusCode: 429,
    });
    res.status(429).json({ message: 'Too many login attempts. Please try again in a minute.' });
  },
  skipSuccessfulRequests: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    await createAuditLog({
      event: SecurityEventType.RATE_LIMIT_EXCEEDED,
      req,
      details: { reason: 'auth endpoint rate limit exceeded', endpoint: req.originalUrl },
      severity: 'HIGH',
      statusCode: 429,
    });
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    await createAuditLog({
      event: SecurityEventType.RATE_LIMIT_EXCEEDED,
      req,
      details: { reason: 'api rate limit exceeded', endpoint: req.originalUrl },
      severity: 'HIGH',
      statusCode: 429,
    });
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});