const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Bank = require('../models/Bank');
const Role = require('../models/Role');

exports.getBankStaff = async (req, res) => {
  try {
    const { bankId } = req.params;

    const staff = await User.findAll({
      where: { bankId },
      include: [{
        model: Role,
        attributes: ['name', 'permissions']
      }],
      attributes: [
        'id', 
        'email', 
        'firstName', 
        'lastName', 
        'status', 
        'lastLogin',
        'department'
      ]
    });

    const formattedStaff = staff.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      lastLogin: user.lastLogin,
      department: user.department,
      role: user.Role.name,
      permissions: user.Role.permissions
    }));

    res.json(formattedStaff);
  } catch (error) {
    console.error('Error fetching bank staff:', error);
    res.status(500).json({ message: 'Failed to fetch bank staff' });
  }
};

exports.createBankStaff = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { email, firstName, lastName, role, department } = req.body;

    // Check if bank exists
    const bank = await Bank.findByPk(bankId);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Find role
    const staffRole = await Role.findOne({ where: { name: role } });
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

    // TODO: Send email with credentials

    res.status(201).json({
      ...staff.toJSON(),
      password: undefined
    });
  } catch (error) {
    console.error('Error creating bank staff:', error);
    res.status(500).json({ message: 'Failed to create bank staff' });
  }
};

exports.updateBankStaff = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;
    const { firstName, lastName, email, department, status } = req.body;

    const staff = await User.findOne({
      where: { id: staffId, bankId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({
      firstName,
      lastName,
      email,
      department,
      status
    });

    res.json(staff);
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
      where: { id: staffId, bankId },
      include: [{ model: Role }]
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Update roles
    const role = await Role.findOne({ where: { name: roles[0] } }); // Assuming single role for now
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await staff.update({ roleId: role.id });

    res.json({
      message: 'Staff roles updated successfully',
      roles: roles
    });
  } catch (error) {
    console.error('Error updating staff roles:', error);
    res.status(500).json({ message: 'Failed to update staff roles' });
  }
};