import { IUser } from '../models/User';
import { TokenPayload } from '../utils/jwt';
interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    };
}
interface LoginResult {
    user: IUser;
    token: string;
}
export declare const registerUser: (input: RegisterInput) => Promise<LoginResult>;
export declare const loginUser: (email: string, password: string, req?: any) => Promise<LoginResult>;
export declare const logoutUser: (userId: string, req?: any) => Promise<void>;
export declare const requestPasswordReset: (email: string, req?: any) => Promise<string>;
export declare const resetPassword: (token: string, newPassword: string, req?: any) => Promise<void>;
export declare const changePassword: (userId: string, currentPassword: string, newPassword: string, req?: any) => Promise<void>;
export declare const getCurrentUser: (userId: string) => Promise<IUser>;
export declare const authenticateToken: (token: string) => TokenPayload;
export {};
//# sourceMappingURL=auth.service.d.ts.map