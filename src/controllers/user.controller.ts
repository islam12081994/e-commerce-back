import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AuthRequest } from '../middleware/auth';

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.listUsers(req.query as any);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserProfile(req.params.id, req.body, req.user!.id, req);
    res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id, req.user!.id, req);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

export const changeRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.changeUserRole(req.params.id, req.body.role, req.user!.id, req);
    res.status(200).json({ success: true, message: 'User role changed', data: user });
  } catch (err) {
    next(err);
  }
};

export const toggleDisable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.disableUser(req.params.id, req.user!.id, req);
    res.status(200).json({
      success: true,
      message: user.isActive ? 'User enabled' : 'User disabled',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};