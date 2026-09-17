import { securityLogger, auditLogger, sanitizeLogData } from './logger';
import { getClientIp, getClientUserAgent } from './helpers';
import SecurityEvent, { SecurityEventType } from '../models/SecurityEvent';
import mongoose from 'mongoose';

interface AuditLogParams {
  event: SecurityEventType;
  userId?: string;
  req?: any;
  details?: Record<string, any>;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  statusCode?: number;
}

const severityMap: Record<SecurityEventType, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
  [SecurityEventType.LOGIN_SUCCESS]: 'LOW',
  [SecurityEventType.LOGIN_FAILED]: 'MEDIUM',
  [SecurityEventType.LOGOUT]: 'LOW',
  [SecurityEventType.PASSWORD_CHANGED]: 'MEDIUM',
  [SecurityEventType.PASSWORD_RESET_REQUEST]: 'MEDIUM',
  [SecurityEventType.ACCOUNT_DISABLED]: 'HIGH',
  [SecurityEventType.UNAUTHORIZED_ACCESS]: 'HIGH',
  [SecurityEventType.FORBIDDEN_ACCESS]: 'HIGH',
  [SecurityEventType.INVALID_TOKEN]: 'MEDIUM',
  [SecurityEventType.EXPIRED_TOKEN]: 'LOW',
  [SecurityEventType.SUSPICIOUS_REQUEST]: 'HIGH',
  [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'HIGH',
  [SecurityEventType.USER_CREATED]: 'LOW',
  [SecurityEventType.USER_UPDATED]: 'LOW',
  [SecurityEventType.USER_DELETED]: 'HIGH',
  [SecurityEventType.USER_DISABLED]: 'HIGH',
  [SecurityEventType.USER_ROLE_CHANGED]: 'HIGH',
  [SecurityEventType.PRODUCT_CREATED]: 'LOW',
  [SecurityEventType.PRODUCT_UPDATED]: 'LOW',
  [SecurityEventType.PRODUCT_DELETED]: 'MEDIUM',
  [SecurityEventType.ORDER_UPDATED]: 'LOW',
  [SecurityEventType.ORDER_CANCELLED]: 'MEDIUM',
  [SecurityEventType.ORDER_REFUNDED]: 'HIGH',
};

export const createAuditLog = async (params: AuditLogParams): Promise<void> => {
  const {
    event,
    userId,
    req,
    details = {},
    severity,
    statusCode,
  } = params;

  const ip = req ? getClientIp(req) : 'system';
  const userAgent = req ? getClientUserAgent(req) : 'system';
  const effectiveSeverity = severity || severityMap[event] || 'LOW';

  const enrichedDetails = {
    event,
    userId: userId || null,
    IP: ip,
    userAgent,
    method: req?.method || null,
    path: req?.originalUrl || req?.url || null,
    statusCode: statusCode || null,
    severity: effectiveSeverity,
    ...sanitizeLogData(details),
  };

  securityLogger.info(enrichedDetails, `[${event}] ${JSON.stringify(enrichedDetails)}`);
  auditLogger.info(enrichedDetails, `[${event}] ${JSON.stringify(enrichedDetails)}`);

  try {
    await SecurityEvent.create({
      eventType: event,
      userId: userId && mongoose.isValidObjectId(userId) ? userId : undefined,
      ip,
      userAgent,
      details: JSON.stringify(sanitizeLogData(details)),
      severity: effectiveSeverity,
    });
  } catch (err) {
    securityLogger.error({ event, err: (err as Error).message }, 'Failed to persist security event');
  }
};