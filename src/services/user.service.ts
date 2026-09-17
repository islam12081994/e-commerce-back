import User from '../models/User';
import Order from '../models/Order';
import Payment from '../models/Payment';
import { AppError, AppErrorCode } from '../middleware/errorHandler';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';
import { isValidObjectId } from '../utils/helpers';

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export const listUsers = async (filters: UserFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const query: any = {};

  if (filters.search) {
    query.$or = [
      { firstName: { $regex: filters.search, $options: 'i' } },
      { lastName: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
    ];
  }
  if (filters.role) query.role = filters.role;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

export const getUserById = async (id: string) => {
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400, AppErrorCode.BAD_REQUEST);
  }
  const user = await User.findById(id).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }
  return user;
};

export const updateUserProfile = async (id: string, data: any, actingAdminId: string, req?: any) => {
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400, AppErrorCode.BAD_REQUEST);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }

  if (data.firstName) user.firstName = data.firstName;
  if (data.lastName) user.lastName = data.lastName;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.address) user.address = { ...(user.address as any), ...data.address };

  await user.save();

  await createAuditLog({
    event: SecurityEventType.USER_UPDATED,
    req,
    userId: actingAdminId,
    details: { targetUserId: id, fieldsUpdated: Object.keys(data) },
    severity: 'LOW',
  });

  const { passwordHash, ...safeUser } = user.toObject();
  void passwordHash;
  return safeUser;
};

export const deleteUser = async (id: string, actingAdminId: string, req?: any): Promise<void> => {
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400, AppErrorCode.BAD_REQUEST);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (user.id === actingAdminId) {
    throw new AppError('You cannot delete your own account', 400, AppErrorCode.BAD_REQUEST);
  }

  await Order.deleteMany({ userId: id });
  await Payment.deleteMany({ userId: id });
  await user.deleteOne();

  await createAuditLog({
    event: SecurityEventType.USER_DELETED,
    req,
    userId: actingAdminId,
    details: { targetUserId: id, targetEmail: user.email },
    severity: 'HIGH',
  });
};

export const changeUserRole = async (id: string, role: 'ADMIN' | 'CUSTOMER', actingAdminId: string, req?: any) => {
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400, AppErrorCode.BAD_REQUEST);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (user.id === actingAdminId && role !== 'ADMIN') {
    throw new AppError('You cannot demote your own account', 400, AppErrorCode.BAD_REQUEST);
  }

  const previousRole = user.role;
  user.role = role;
  await user.save();

  await createAuditLog({
    event: SecurityEventType.USER_ROLE_CHANGED,
    req,
    userId: actingAdminId,
    details: { targetUserId: id, targetEmail: user.email, from: previousRole, to: role },
    severity: 'HIGH',
  });

  const { passwordHash, ...safeUser } = user.toObject();
  void passwordHash;
  return safeUser;
};

export const disableUser = async (id: string, actingAdminId: string, req?: any) => {
  if (!isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400, AppErrorCode.BAD_REQUEST);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }
  if (user.id === actingAdminId) {
    throw new AppError('You cannot disable your own account', 400, AppErrorCode.BAD_REQUEST);
  }

  user.isActive = !user.isActive;
  await user.save();

  await createAuditLog({
    event: SecurityEventType.USER_DISABLED,
    req,
    userId: actingAdminId,
    details: { targetUserId: id, targetEmail: user.email, isActive: user.isActive },
    severity: 'HIGH',
  });

  const { passwordHash, ...safeUser } = user.toObject();
  void passwordHash;
  return safeUser;
};