interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}
export declare const listUsers: (filters: UserFilters) => Promise<{
    users: (import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    total: number;
    page: number;
    totalPages: number;
}>;
export declare const getUserById: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const updateUserProfile: (id: string, data: any, actingAdminId: string, req?: any) => Promise<{
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    isActive: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    _id: import("mongoose").Types.ObjectId;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: import("mongoose").Collection;
    db: import("mongoose").Connection;
    errors?: import("mongoose").Error.ValidationError;
    id?: any;
    isNew: boolean;
    schema: import("mongoose").Schema;
    __v: number;
}>;
export declare const deleteUser: (id: string, actingAdminId: string, req?: any) => Promise<void>;
export declare const changeUserRole: (id: string, role: "ADMIN" | "CUSTOMER", actingAdminId: string, req?: any) => Promise<{
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    isActive: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    _id: import("mongoose").Types.ObjectId;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: import("mongoose").Collection;
    db: import("mongoose").Connection;
    errors?: import("mongoose").Error.ValidationError;
    id?: any;
    isNew: boolean;
    schema: import("mongoose").Schema;
    __v: number;
}>;
export declare const disableUser: (id: string, actingAdminId: string, req?: any) => Promise<{
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    isActive: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    _id: import("mongoose").Types.ObjectId;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: import("mongoose").Collection;
    db: import("mongoose").Connection;
    errors?: import("mongoose").Error.ValidationError;
    id?: any;
    isNew: boolean;
    schema: import("mongoose").Schema;
    __v: number;
}>;
export {};
//# sourceMappingURL=user.service.d.ts.map