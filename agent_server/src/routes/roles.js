const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Get all roles with their permissions
router.get('/roles', auth, checkRole(['super_admin']), async (req, res) => {
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
router.get('/roles/permissions', auth, checkRole(['super_admin']), async (req, res) => {
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
router.post('/roles', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { name, group, description, permissions } = req.body;
    
    const role = await Role.create({ 
      name, 
      group,
      description 
    });

    if (permissions && permissions.length > 0) {
      await role.setPermissions(permissions);
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
router.put('/roles/:id', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, group, description, permissions } = req.body;
    
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.update({ name, group, description });

    if (permissions) {
      await role.setPermissions(permissions);
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
router.delete('/roles/:id', auth, checkRole(['super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
});

module.exports = router;