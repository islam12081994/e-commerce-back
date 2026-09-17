import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getSecurityEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const eventType = req.query.eventType as string | undefined;
    const severity = req.query.severity as string | undefined;
    const result = await adminService.getSecurityEvents({ eventType, severity, page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getSecurityEventTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const types = await adminService.getSecurityEventTypes();
    res.status(200).json({ success: true, data: types });
  } catch (err) {
    next(err);
  }
};