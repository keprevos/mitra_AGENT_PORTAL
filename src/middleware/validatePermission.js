import { auditService } from '../services/auditService.js';

export const validatePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const userPermissions = await getUserPermissions(user.role);

      if (!userPermissions.includes(permission)) {
        await auditService.logAction(
          user.id,
          'unauthorized_access',
          'permission',
          null,
          { requiredPermission: permission },
          req.ip
        );
        return res.status(403).json({
          message: 'You do not have permission to perform this action'
        });
      }

      next();
    } catch (error) {
      console.error('Permission validation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

async function getUserPermissions(roleId) {
  const [rows] = await pool.query(
    `SELECT p.name
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = ?`,
    [roleId]
  );
  
  return rows.map(row => row.name);
}