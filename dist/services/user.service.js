"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableUser = exports.changeUserRole = exports.deleteUser = exports.updateUserProfile = exports.getUserById = exports.listUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const Payment_1 = __importDefault(require("../models/Payment"));
const errorHandler_1 = require("../middleware/errorHandler");
const auditLogger_1 = require("../utils/auditLogger");
const SecurityEvent_1 = require("../models/SecurityEvent");
const helpers_1 = require("../utils/helpers");
const listUsers = async (filters) => {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const query = {};
    if (filters.search) {
        query.$or = [
            { firstName: { $regex: filters.search, $options: 'i' } },
            { lastName: { $regex: filters.search, $options: 'i' } },
            { email: { $regex: filters.search, $options: 'i' } },
        ];
    }
    if (filters.role)
        query.role = filters.role;
    if (filters.isActive !== undefined)
        query.isActive = filters.isActive;
    const [users, total] = await Promise.all([
        User_1.default.find(query)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        User_1.default.countDocuments(query),
    ]);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
};
exports.listUsers = listUsers;
const getUserById = async (id) => {
    if (!(0, helpers_1.isValidObjectId)(id)) {
        throw new errorHandler_1.AppError('Invalid user id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(id).select('-passwordHash');
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    return user;
};
exports.getUserById = getUserById;
const updateUserProfile = async (id, data, actingAdminId, req) => {
    if (!(0, helpers_1.isValidObjectId)(id)) {
        throw new errorHandler_1.AppError('Invalid user id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (data.firstName)
        user.firstName = data.firstName;
    if (data.lastName)
        user.lastName = data.lastName;
    if (data.phone !== undefined)
        user.phone = data.phone;
    if (data.address)
        user.address = { ...user.address, ...data.address };
    await user.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.USER_UPDATED,
        req,
        userId: actingAdminId,
        details: { targetUserId: id, fieldsUpdated: Object.keys(data) },
        severity: 'LOW',
    });
    const { passwordHash, ...safeUser } = user.toObject();
    void passwordHash;
    return safeUser;
};
exports.updateUserProfile = updateUserProfile;
const deleteUser = async (id, actingAdminId, req) => {
    if (!(0, helpers_1.isValidObjectId)(id)) {
        throw new errorHandler_1.AppError('Invalid user id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (user.id === actingAdminId) {
        throw new errorHandler_1.AppError('You cannot delete your own account', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    await Order_1.default.deleteMany({ userId: id });
    await Payment_1.default.deleteMany({ userId: id });
    await user.deleteOne();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.USER_DELETED,
        req,
        userId: actingAdminId,
        details: { targetUserId: id, targetEmail: user.email },
        severity: 'HIGH',
    });
};
exports.deleteUser = deleteUser;
const changeUserRole = async (id, role, actingAdminId, req) => {
    if (!(0, helpers_1.isValidObjectId)(id)) {
        throw new errorHandler_1.AppError('Invalid user id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (user.id === actingAdminId && role !== 'ADMIN') {
        throw new errorHandler_1.AppError('You cannot demote your own account', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const previousRole = user.role;
    user.role = role;
    await user.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.USER_ROLE_CHANGED,
        req,
        userId: actingAdminId,
        details: { targetUserId: id, targetEmail: user.email, from: previousRole, to: role },
        severity: 'HIGH',
    });
    const { passwordHash, ...safeUser } = user.toObject();
    void passwordHash;
    return safeUser;
};
exports.changeUserRole = changeUserRole;
const disableUser = async (id, actingAdminId, req) => {
    if (!(0, helpers_1.isValidObjectId)(id)) {
        throw new errorHandler_1.AppError('Invalid user id', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new errorHandler_1.AppError('User not found', 404, errorHandler_1.AppErrorCode.NOT_FOUND);
    }
    if (user.id === actingAdminId) {
        throw new errorHandler_1.AppError('You cannot disable your own account', 400, errorHandler_1.AppErrorCode.BAD_REQUEST);
    }
    user.isActive = !user.isActive;
    await user.save();
    await (0, auditLogger_1.createAuditLog)({
        event: SecurityEvent_1.SecurityEventType.USER_DISABLED,
        req,
        userId: actingAdminId,
        details: { targetUserId: id, targetEmail: user.email, isActive: user.isActive },
        severity: 'HIGH',
    });
    const { passwordHash, ...safeUser } = user.toObject();
    void passwordHash;
    return safeUser;
};
exports.disableUser = disableUser;
//# sourceMappingURL=user.service.js.map