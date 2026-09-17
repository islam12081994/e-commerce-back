import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const generateOrderNumber = (): string =>
  `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

export const generateTransactionReference = (): string =>
  `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

export const generateResetToken = (): string => crypto.randomBytes(32).toString('hex');

export const sanitize = (value: string): string => {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitize(value) : value;
  }
  return result;
};

export const getClientIp = (req: any): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

export const getClientUserAgent = (req: any): string => {
  return req.headers['user-agent'] || 'unknown';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidObjectId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return 'An unknown error occurred';
};