const Agent = require('../models/Agent');
const User = require('../models/User');
const Role = require('../models/Role');
const Bank = require('../models/Bank');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.createAgent = async (req, res) => {
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

    // Create agent
    const agent = await Agent.create({
      id: uuidv4(),
      name,
      code,
      email,
      phone,
      address,
      bankId,
      status: 'active'
    });

    // Create agent admin user
    const agentAdminRole = await Role.findOne({ where: { name: 'agent_admin' } });
    if (!agentAdminRole) {
      return res.status(404).json({ message: 'Agent admin role not found' });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail,
      firstName: adminFirstName,
      lastName: adminLastName,
      password: hashedPassword,
      roleId: agentAdminRole.id,
      agentId: agent.id,
      bankId,
      status: 'active'
    });

    res.status(201).json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Failed to create agent' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const { bankId } = req.params;
    const agents = await Agent.findAll({
      where: { bankId },
      include: [{
        model: User,
        attributes: ['id'],
        required: false
      }]
    });

    const agentsWithStaffCount = agents.map(agent => ({
      ...agent.toJSON(),
      staffCount: agent.Users?.length || 0
    }));

    res.json(agentsWithStaffCount);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const { bankId, agentId } = req.params;
    const { name, code, email, phone, address, status } = req.body;

    const agent = await Agent.findOne({
      where: { id: agentId, bankId }
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await agent.update({
      name,
      code,
      email,
      phone,
      address,
      status
    });

    res.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ message: 'Failed to update agent' });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const { bankId, agentId } = req.params;
    const agent = await Agent.findOne({
      where: { id: agentId, bankId }
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await agent.update({ status: 'inactive' });
    res.json({ message: 'Agent deactivated successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Failed to delete agent' });
  }
};

exports.createAgentStaff = async (req, res) => {
  try {
    const { bankId, agentId } = req.params;
    const { email, firstName, lastName, role, department } = req.body;

    // Verify agent exists and belongs to bank
    const agent = await Agent.findOne({
      where: { id: agentId, bankId }
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
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
      agentId,
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
    console.error('Error creating agent staff:', error);
    res.status(500).json({ message: 'Failed to create agent staff' });
  }
};

exports.getAgentStaff = async (req, res) => {
  try {
    const { bankId, agentId } = req.params;
    const staff = await User.findAll({
      where: { agentId, bankId },
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

    res.json(staff);
  } catch (error) {
    console.error('Error fetching agent staff:', error);
    res.status(500).json({ message: 'Failed to fetch agent staff' });
  }
};