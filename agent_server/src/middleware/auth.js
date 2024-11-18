const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({ 
      where: { id: decoded.userId },
      include: [{ model: Role }]
    });

    if (!user || user.status !== 'active') {
      throw new Error();
    }

    req.user = user;
    req.role = user.Role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.role.name) && !req.role.permissions.all) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, checkRole };