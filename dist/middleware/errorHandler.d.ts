import { Request, Response, NextFunction } from 'express';
export declare enum AppErrorCode {
    VALIDATION = "VALIDATION",
    NOT_FOUND = "NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    CONFLICT = "CONFLICT",
    RATE_LIMITED = "RATE_LIMITED",
    INTERNAL = "INTERNAL",
    BAD_REQUEST = "BAD_REQUEST"
}
export declare class AppError extends Error {
    statusCode: number;
    code: AppErrorCode;
    constructor(message: string, statusCode: number, code?: AppErrorCode);
}
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=errorHandler.d.ts.map