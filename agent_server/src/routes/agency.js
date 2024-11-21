const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const Agency = require('../models/Agency');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Get agency statistics
router.get('/statistics', auth, checkRole(['agency_admin']), async (req, res) => {
  try {
    const { agencyId } = req.user;
    
    // Get staff count
    const staffCount = await User.count({
      where: { agencyId, status: 'active' }
    });

    // Mock data for demonstration
    const statistics = {
      totalStaff: staffCount,
      totalCustomers: 150,
      activeTransactions: 25,
      monthlyGrowth: 15,
      recentActivity: [
        {
          id: 1,
          type: 'staff_added',
          content: 'New staff member added',
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          type: 'customer_added',
          content: 'New customer onboarded',
          timestamp: '3 hours ago'
        }
      ]
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching agency statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Staff Management
router.get('/staff', auth, checkRole(['agency_admin']), async (req, res) => {
  try {
    const { agencyId } = req.user;
    const staff = await User.findAll({
      where: { agencyId },
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

    const formattedStaff = staff.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.Role?.name || 'Unknown',
      status: user.status,
      lastLogin: user.lastLogin,
      department: user.department,
      permissions: user.Role?.permissions?.map(p => p.name) || []
    }));

    res.json(formattedStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// Create staff member
router.post('/staff', auth, checkRole(['agency_admin']), async (req, res) => {
  try {
    const { agencyId, bankId } = req.user;
    const { email, firstName, lastName, role, department } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const staffRole = await Role.findOne({ 
      where: { name: role },
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!staffRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      roleId: staffRole.id,
      agencyId,
      bankId,
      department,
      status: 'active'
    });

    // TODO: Send email with credentials

    res.status(201).json({
      id: staff.id,
      email: staff.email,
      firstName: staff.firstName,
      lastName: staff.lastName,
      role: staffRole.name,
      department: staff.department,
      status: staff.status,
      temporaryPassword: password // Only for development
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Failed to create staff' });
  }
});

// Update staff member
router.put('/staff/:id', auth, checkRole(['agency_admin']), async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;
    const { firstName, lastName, email, role, department, status } = req.body;

    const staff = await User.findOne({
      where: { id, agencyId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // If email is being changed, check if new email is available
    if (email !== staff.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    let roleId = staff.roleId;
    if (role) {
      const newRole = await Role.findOne({ where: { name: role } });
      if (!newRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
      roleId = newRole.id;
    }

    await staff.update({
      firstName,
      lastName,
      email,
      roleId,
      department,
      status
    });

    const updatedStaff = await User.findOne({
      where: { id },
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

    res.json({
      id: updatedStaff.id,
      email: updatedStaff.email,
      firstName: updatedStaff.firstName,
      lastName: updatedStaff.lastName,
      role: updatedStaff.Role?.name,
      department: updatedStaff.department,
      status: updatedStaff.status,
      permissions: updatedStaff.Role?.permissions?.map(p => p.name) || []
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Failed to update staff' });
  }
});

// Delete staff member
router.delete('/staff/:id', auth, checkRole(['agency_admin']), async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    const staff = await User.findOne({
      where: { id, agencyId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({ status: 'inactive' });
    res.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Failed to delete staff' });
  }
});

module.exports = router;