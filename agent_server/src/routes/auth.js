const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Fetch user with associated role and permissions
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Role,
//           attributes: ['name'], // Fetch role name
//           include: [
//             {
//               model: Permission,
//               through: { attributes: [] }, // Exclude junction table attributes
//               attributes: ['name', 'description', 'category']
//             }
//           ]
//         }
//       ]
//     });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Check user status
//     if (user.status !== 'active') {
//       return res.status(403).json({ message: 'Account is inactive' });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Extract permissions
//     const permissions = user.Role?.Permissions?.map((permission) => ({
//       name: permission.name,
//       description: permission.description,
//       category: permission.category
//     })) || [];

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         roleId: user.roleId
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Return response
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.Role?.name || 'Unknown',
//         permissions
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['name'],
          include: [
            {
              model: Permission,
              as: 'permissions', // Use the alias defined in the Role model
              attributes: ['name', 'description', 'category']
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const permissions = user.Role?.permissions?.map((permission) => ({
      name: permission.name,
      description: permission.description,
      category: permission.category
    })) || [];

    const token = jwt.sign(
      { userId: user.id, roleId: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.Role?.name || 'Unknown',
        permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
