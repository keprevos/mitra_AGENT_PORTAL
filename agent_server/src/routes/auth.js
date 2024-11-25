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
        attributes: ['name'],
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

    // Generate JWT token with additional claims
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        role: user.Role.name,
        bankId: user.bankId,
        agencyId: user.agencyId
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
      { expiresIn: '7d' }
    );

    // Return response
    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
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

router.post('/validate-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Role,
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ valid: false });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.Role?.name,
        permissions: user.Role?.permissions,
        bankId: user.bankId,
        agencyId: user.agencyId,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ valid: false });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key');
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Role,
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        role: user.Role.name,
        bankId: user.bankId,
        agencyId: user.agencyId
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client will handle removing the tokens
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;