const BankStaff = require('../models/BankStaff');
const User = require('../models/User');
const Bank = require('../models/Bank');
const { validatePermissions } = require('../middleware/validatePermission');

exports.addStaff = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { email, firstName, lastName, role, permissions } = req.body;

    // Create user first
    const user = await User.create({
      email,
      firstName,
      lastName,
      password: Math.random().toString(36).slice(-8), // Generate random password
      roleId: role
    });

    // Create bank staff association
    const bankStaff = await BankStaff.create({
      bankId,
      userId: user.id,
      role,
      permissions
    });

    // Send email with credentials (implement email service)

    res.status(201).json({
      message: 'Staff member added successfully',
      data: bankStaff
    });
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Failed to add staff member' });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { bankId };
    if (search) {
      whereClause['$User.firstName$'] = { [Op.like]: `%${search}%` };
    }

    const staff = await BankStaff.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['id', 'email', 'firstName', 'lastName']
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: staff.rows,
      total: staff.count,
      currentPage: page,
      totalPages: Math.ceil(staff.count / limit)
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
};

exports.getStaffMember = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;

    const staff = await BankStaff.findOne({
      where: { bankId, id: staffId },
      include: [{
        model: User,
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({ data: staff });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ message: 'Failed to fetch staff member' });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;
    const { role, permissions } = req.body;

    const staff = await BankStaff.findOne({
      where: { bankId, id: staffId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({
      role,
      permissions
    });

    res.json({
      message: 'Staff member updated successfully',
      data: staff
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Failed to update staff member' });
  }
};

exports.deactivateStaff = async (req, res) => {
  try {
    const { bankId, staffId } = req.params;

    const staff = await BankStaff.findOne({
      where: { bankId, id: staffId }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({ status: 'inactive' });

    res.json({
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating staff:', error);
    res.status(500).json({ message: 'Failed to deactivate staff member' });
  }
};