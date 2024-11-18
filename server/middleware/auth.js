import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/auth.config.js';
import { userModel } from '../models/userModel.js';
import { auditService } from '../services/auditService.js';

export const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Account is inactive' });
      }

      if (roles.length && !roles.includes(user.role)) {
        await auditService.logAction(
          user.id,
          'unauthorized_access',
          'permission',
          null,
          { requiredRoles: roles, userRole: user.role },
          req.ip
        );
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.error('Auth middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};