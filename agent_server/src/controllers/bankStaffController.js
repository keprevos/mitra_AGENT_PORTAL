const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const bcrypt = require('bcryptjs');

exports.getBankStaff = async (req, res) => {
  try {
    const { bankId } = req.params;
    const staff = await User.findAll({
      where: { bankId },
      include: [{
        model: Role,
        attributes: ['name'],
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      }],
      attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'lastLogin', 'department']
    });

    res.json(staff);
  } catch (error) {
    console.error('Error fetching bank staff:', error);
    res.status(500).json({ message: 'Failed to fetch bank staff' });
  }
};

exports.createBankStaff = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { email, firstName, lastName, role, department } = req.body;

    // Find role
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
      bankId,
      department,
      status: 'active'
    });

    // Format response
    const response = {
      id: staff.id,
      email: staff.email,
      firstName: staff.firstName,
      lastName: staff.lastName,
      department: staff.department,
      status: staff.status,
      role: staffRole.name,
      permissions: staffRole.permissions
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating bank staff:', error);
    res.status(500).json({ message: 'Failed to create bank staff' });
  }
};

exports.updateBankStaff = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;
    const { firstName, lastName, email, role, department, status } = req.body;

    const staff = await User.findOne({
      where: { id: staffId, bankId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // If role is being updated, verify the new role exists
    let newRole;
    if (role) {
      newRole = await Role.findOne({ 
        where: { name: role },
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      });

      if (!newRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
    }

    await staff.update({
      firstName,
      lastName,
      email,
      roleId: newRole?.id,
      department,
      status
    });

    const updatedStaff = await User.findOne({
      where: { id: staffId },
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

    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating bank staff:', error);
    res.status(500).json({ message: 'Failed to update bank staff' });
  }
};

exports.deleteBankStaff = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;
    const staff = await User.findOne({
      where: { id: staffId, bankId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({ status: 'inactive' });
    res.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    console.error('Error deleting bank staff:', error);
    res.status(500).json({ message: 'Failed to delete bank staff' });
  }
};

exports.updateStaffRoles = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;
    const { roles } = req.body;

    const staff = await User.findOne({
      where: { id: staffId, bankId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const role = await Role.findOne({ 
      where: { name: roles[0] },
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await staff.update({ roleId: role.id });

    const updatedStaff = await User.findOne({
      where: { id: staffId },
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

    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff roles:', error);
    res.status(500).json({ message: 'Failed to update staff roles' });
  }
};