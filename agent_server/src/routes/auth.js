const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Fetch user with associated role and permissions
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      }]
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      console.log('User inactive:', email);
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Extract permissions
    const permissions = user.Role?.permissions?.map(permission => ({
      name: permission.name,
      description: permission.description,
      category: permission.category
    })) || [];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.roleId,
        role: user.Role.name
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key', // Fallback secret for development
      { expiresIn: '24h' }
    );

    // Return response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.Role?.name || 'Unknown',
        permissions,
        bankId: user.bankId,
        agencyId: user.agencyId,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;