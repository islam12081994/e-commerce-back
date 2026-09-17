import pino from 'pino';
import path from 'path';
import config from '../config';

const logDir = path.join(__dirname, '../../logs');

const createLogger = (filename: string) => {
  return pino({
    level: config.logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: { service: 'ecommerce-siem' },
  }, pino.transport({
    targets: [
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: path.join(logDir, filename), mkdir: true },
      },
      {
        target: 'pino/file',
        level: config.nodeEnv === 'development' ? 'info' : 'error',
        options: { destination: 1 },
      },
    ],
  }));
};

export const appLogger = createLogger('application.log');
export const securityLogger = createLogger('security.log');
export const auditLogger = createLogger('audit.log');

export const sanitizeLogData = (data: Record<string, any>): Record<string, any> => {
  const sensitiveFields = ['password', 'passwordHash', 'token', 'cvv', 'creditCard', 'secret'];
  const sanitized = { ...data };
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
};

export default appLogger;
