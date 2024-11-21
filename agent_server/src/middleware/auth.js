const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user with associated role and permissions
    const user = await User.findOne({ 
      where: { id: decoded.userId },
      include: [
        {
          model: Role,
          attributes: ['name'],
          include: [
            {
              model: Permission,
              as: 'permissions', // Alias defined in the Role model
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (!user || user.status !== 'active') {
      throw new Error('User not found or inactive');
    }

    req.user = user;
    req.role = user.Role;
    req.permissions = user.Role?.permissions || [];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.role.name)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    // Check if the user has the required permission
    const hasPermission = req.permissions.some((permission) => permission.name === permissionName);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};

module.exports = { auth, checkRole, checkPermission };
