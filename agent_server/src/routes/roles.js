const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Get all roles with their permissions
router.get('/', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
});

// Get all permissions
router.get('/permissions', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
});

// Create new role
router.post('/', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { name, group, description, permissions } = req.body;
    
    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await Role.create({ 
      name, 
      group,
      description 
    });

    if (permissions && permissions.length > 0) {
      const permissionRecords = await Permission.findAll({
        where: { id: permissions }
      });
      await role.setPermissions(permissionRecords);
    }

    const roleWithPermissions = await Role.findByPk(role.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    res.status(201).json(roleWithPermissions);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Failed to create role' });
  }
});

// Update role
router.put('/:id', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, group, description, permissions } = req.body;
    
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if new name conflicts with existing role
    if (name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
    }

    await role.update({ name, group, description });

    if (permissions) {
      const permissionRecords = await Permission.findAll({
        where: { id: permissions }
      });
      await role.setPermissions(permissionRecords);
    }

    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// Delete role
router.delete('/:id', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Prevent deletion of system roles
    if (['super_admin', 'bank_admin', 'bank_staff', 'agency_admin', 'agent_staff'].includes(role.name)) {
      return res.status(403).json({ message: 'Cannot delete system roles' });
    }

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
});

// Assign permissions to role
router.put('/:id/permissions', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const permissionRecords = await Permission.findAll({
      where: { id: permissions }
    });

    await role.setPermissions(permissionRecords);

    const updatedRole = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    res.json(updatedRole);
  } catch (error) {
    console.error('Error assigning permissions:', error);
    res.status(500).json({ message: 'Failed to assign permissions' });
  }
});

module.exports = router;