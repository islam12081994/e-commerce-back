export declare const getDashboardStats: () => Promise<{
    totals: {
        users: number;
        products: number;
        orders: number;
        revenue: any;
    };
    needsAttention: ({
        label: string;
        count: number;
        severity: "MEDIUM";
    } | {
        label: string;
        count: number;
        severity: "HIGH";
    })[];
    recentSecurityEvents: (import("mongoose").Document<unknown, {}, import("../models/SecurityEvent").ISecurityEvent, {}, {}> & import("../models/SecurityEvent").ISecurityEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    salesByMonth: any[];
    ordersByStatus: any[];
    topProducts: any[];
    generatedAt: string;
}>;
export declare const getSecurityEvents: (filters: {
    eventType?: string;
    severity?: string;
    page: number;
    limit: number;
}) => Promise<{
    events: (import("mongoose").Document<unknown, {}, import("../models/SecurityEvent").ISecurityEvent, {}, {}> & import("../models/SecurityEvent").ISecurityEvent & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    totalPages: number;
}>;
export declare const getSecurityEventTypes: () => Promise<string[]>;
//# sourceMappingURL=admin.service.d.ts.map