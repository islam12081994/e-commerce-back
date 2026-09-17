import { SecurityEventType } from '../models/SecurityEvent';
interface AuditLogParams {
    event: SecurityEventType;
    userId?: string;
    req?: any;
    details?: Record<string, any>;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    statusCode?: number;
}
export declare const createAuditLog: (params: AuditLogParams) => Promise<void>;
export {};
//# sourceMappingURL=auditLogger.d.ts.map