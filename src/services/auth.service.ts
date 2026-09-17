import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { generateToken, verifyToken, TokenPayload } from '../utils/jwt';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';
import { AppError, AppErrorCode } from '../middleware/errorHandler';

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

const resetTokens = new Map<string, { userId: string; expiresAt: number }>();

export const registerUser = async (input: RegisterInput): Promise<LoginResult> => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, AppErrorCode.CONFLICT);
  }

  const user = await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    passwordHash: input.password,
    phone: input.phone || '',
    address: {
      street: input.address?.street || '',
      city: input.address?.city || '',
      state: input.address?.state || '',
      zipCode: input.address?.zipCode || '',
    },
  });

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string, req?: any): Promise<LoginResult> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    await createAuditLog({
      event: SecurityEventType.LOGIN_FAILED,
      req,
      details: { reason: 'unknown email', email: email.toLowerCase() },
      severity: 'MEDIUM',
      statusCode: 401,
    });
    throw new AppError('Invalid email or password', 401, AppErrorCode.UNAUTHORIZED);
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    await createAuditLog({
      event: SecurityEventType.LOGIN_FAILED,
      req,
      userId: user.id,
      details: { reason: 'wrong password', email: user.email },
      severity: 'MEDIUM',
      statusCode: 401,
    });
    throw new AppError('Invalid email or password', 401, AppErrorCode.UNAUTHORIZED);
  }

  if (!user.isActive) {
    await createAuditLog({
      event: SecurityEventType.ACCOUNT_DISABLED,
      req,
      userId: user.id,
      details: { reason: 'attempted login with disabled account' },
      severity: 'HIGH',
      statusCode: 403,
    });
    throw new AppError('This account has been disabled', 403, AppErrorCode.FORBIDDEN);
  }

  user.lastLoginAt = new Date();
  await user.save();

  await createAuditLog({
    event: SecurityEventType.LOGIN_SUCCESS,
    req,
    userId: user.id,
    details: { email: user.email },
    severity: 'LOW',
    statusCode: 200,
  });

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const logoutUser = async (userId: string, req?: any): Promise<void> => {
  await createAuditLog({
    event: SecurityEventType.LOGOUT,
    req,
    userId,
    details: {},
    severity: 'LOW',
  });
};

export const requestPasswordReset = async (email: string, req?: any): Promise<string> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('No account found with this email', 404, AppErrorCode.NOT_FOUND);
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = Date.now() + 30 * 60 * 1000;
  resetTokens.set(hashedToken, { userId: user.id, expiresAt });

  await createAuditLog({
    event: SecurityEventType.PASSWORD_RESET_REQUEST,
    req,
    userId: user.id,
    details: { email: user.email },
    severity: 'MEDIUM',
  });

  return token;
};

export const resetPassword = async (token: string, newPassword: string, req?: any): Promise<void> => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const entry = resetTokens.get(hashedToken);
  if (!entry || entry.expiresAt < Date.now()) {
    resetTokens.delete(hashedToken);
    throw new AppError('Invalid or expired reset token', 400, AppErrorCode.BAD_REQUEST);
  }

  const user = await User.findById(entry.userId);
  if (!user) {
    resetTokens.delete(hashedToken);
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }

  user.passwordHash = newPassword;
  await user.save();
  resetTokens.delete(hashedToken);

  await createAuditLog({
    event: SecurityEventType.PASSWORD_CHANGED,
    req,
    userId: user.id,
    details: { reason: 'password reset via token' },
    severity: 'MEDIUM',
  });
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  req?: any
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }

  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    await createAuditLog({
      event: SecurityEventType.PASSWORD_CHANGED,
      req,
      userId,
      details: { success: false, reason: 'incorrect current password' },
      severity: 'MEDIUM',
      statusCode: 400,
    });
    throw new AppError('Current password is incorrect', 400, AppErrorCode.BAD_REQUEST);
  }

  user.passwordHash = newPassword;
  await user.save();

  await createAuditLog({
    event: SecurityEventType.PASSWORD_CHANGED,
    req,
    userId,
    details: { success: true, reason: 'voluntary password change' },
    severity: 'MEDIUM',
  });
};

export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, AppErrorCode.NOT_FOUND);
  }
  return user;
};

export const authenticateToken = (token: string): TokenPayload => {
  const payload = verifyToken(token);
  return payload;
};