const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Fetch user with associated role
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['name', 'permissions']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check user status
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
      } else {
        console.log('Passwords Match:', isMatch); // Should print true if they match
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.roleId
      },
      process.env.JWT_SECRET,
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
        permissions: user.Role?.permissions || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
