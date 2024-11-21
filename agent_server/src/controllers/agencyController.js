const Agency = require('../models/Agency');
const User = require('../models/User');
const Role = require('../models/Role');
const Bank = require('../models/Bank');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.createAgency = async (req, res) => {
  try {
    const { bankId } = req.params;
    const {
      name,
      code,
      email,
      phone,
      address,
      adminEmail,
      adminFirstName,
      adminLastName,
      adminPassword
    } = req.body;

    // Verify bank exists
    const bank = await Bank.findByPk(bankId);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    // Create agency
    const agency = await Agency.create({
      id: uuidv4(),
      name,
      code,
      email,
      phone,
      address,
      bankId,
      status: 'active'
    });

    // Create agency admin user
    const agencyAdminRole = await Role.findOne({ where: { name: 'agency_admin' } });
    if (!agencyAdminRole) {
      return res.status(404).json({ message: 'Agency admin role not found' });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail,
      firstName: adminFirstName,
      lastName: adminLastName,
      password: hashedPassword,
      roleId: agencyAdminRole.id,
      agencyId: agency.id,
      bankId,
      status: 'active'
    });

    res.status(201).json(agency);
  } catch (error) {
    console.error('Error creating agency:', error);
    res.status(500).json({ message: 'Failed to create agency' });
  }
};

exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.findAll({
      include: [{
        model: Bank,
        attributes: ['name']
      }]
    });

    const formattedAgencies = agencies.map(agency => ({
      ...agency.toJSON(),
      bankName: agency.Bank?.name
    }));

    res.json(formattedAgencies);
  } catch (error) {
    console.error('Error fetching all agencies:', error);
    res.status(500).json({ message: 'Failed to fetch agencies' });
  }
};

exports.getAgencies = async (req, res) => {
  try {
    const { bankId } = req.params;
    const agencies = await Agency.findAll({
      where: { bankId },
      include: [{
        model: Bank,
        attributes: ['name']
      }]
    });

    const formattedAgencies = agencies.map(agency => ({
      ...agency.toJSON(),
      bankName: agency.Bank?.name
    }));

    res.json(formattedAgencies);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({ message: 'Failed to fetch agencies' });
  }
};

exports.updateAgency = async (req, res) => {
  try {
    const { bankId, agencyId } = req.params;
    const { name, code, email, phone, address, status } = req.body;

    const agency = await Agency.findOne({
      where: { id: agencyId, bankId }
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    await agency.update({
      name,
      code,
      email,
      phone,
      address,
      status
    });

    res.json(agency);
  } catch (error) {
    console.error('Error updating agency:', error);
    res.status(500).json({ message: 'Failed to update agency' });
  }
};

exports.deleteAgency = async (req, res) => {
  try {
    const { bankId, agencyId } = req.params;
    const agency = await Agency.findOne({
      where: { id: agencyId, bankId }
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    await agency.update({ status: 'inactive' });
    res.json({ message: 'Agency deactivated successfully' });
  } catch (error) {
    console.error('Error deleting agency:', error);
    res.status(500).json({ message: 'Failed to delete agency' });
  }
};

exports.createAgencyStaff = async (req, res) => {
  try {
    const { bankId, agencyId } = req.params;
    const { email, firstName, lastName, role, department } = req.body;

    // Verify agency exists and belongs to bank
    const agency = await Agency.findOne({
      where: { id: agencyId, bankId }
    });

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
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
      agencyId,
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
    console.error('Error creating agency staff:', error);
    res.status(500).json({ message: 'Failed to create agency staff' });
  }
};

exports.getAgencyStaff = async (req, res) => {
  try {
    const { bankId, agencyId } = req.params;
    const staff = await User.findAll({
      where: { agencyId, bankId },
      include: [{
        model: Role,
        attributes: ['name']
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

    res.json(staff);
  } catch (error) {
    console.error('Error fetching agency staff:', error);
    res.status(500).json({ message: 'Failed to fetch agency staff' });
  }
};