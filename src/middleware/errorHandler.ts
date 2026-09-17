import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getClientIp } from '../utils/helpers';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';

export enum AppErrorCode {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL = 'INTERNAL',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class AppError extends Error {
  statusCode: number;
  code: AppErrorCode;

  constructor(message: string, statusCode: number, code: AppErrorCode = AppErrorCode.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, AppErrorCode.NOT_FOUND));
};

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let code = err.code || AppErrorCode.INTERNAL;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = AppErrorCode.VALIDATION;
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  }

  if (err instanceof mongoose.Error.CastError) {
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

  const publicResponse: any = {
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