import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import { getClientIp, getClientUserAgent } from '../utils/helpers';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const ip = getClientIp(req);
      await createAuditLog({
        event: SecurityEventType.UNAUTHORIZED_ACCESS,
        req,
        details: { reason: 'missing token' },
        severity: 'HIGH',
        statusCode: 401,
      });
      void ip;
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch (err: any) {
      const eventType = err.name === 'TokenExpiredError'
        ? SecurityEventType.EXPIRED_TOKEN
        : SecurityEventType.INVALID_TOKEN;
      await createAuditLog({
        event: eventType,
        req,
        details: { reason: err.name === 'TokenExpiredError' ? 'token expired' : 'invalid token' },
        severity: eventType === SecurityEventType.EXPIRED_TOKEN ? 'LOW' : 'MEDIUM',
        statusCode: 401,
      });
      return res.status(401).json({ message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      await createAuditLog({
        event: SecurityEventType.UNAUTHORIZED_ACCESS,
        req,
        userId: payload.userId,
        details: { reason: !user ? 'user not found' : 'user disabled' },
        severity: 'HIGH',
        statusCode: 401,
      });
      return res.status(401).json({ message: 'User not found or disabled' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    const ip = getClientIp(req);
    void ip;
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'ADMIN') {
    await createAuditLog({
      event: SecurityEventType.FORBIDDEN_ACCESS,
      req,
      userId: req.user.id,
      details: { reason: 'admin role required', attemptedBy: getClientUserAgent(req) },
      severity: 'HIGH',
      statusCode: 403,
    });
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};