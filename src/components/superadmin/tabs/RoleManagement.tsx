import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield, Edit2, Trash2 } from 'lucide-react';
import { Role } from '../../../api/services/role.service';
import { roleService } from '../../../api/services/role.service';
import { RoleForm } from '../forms/RoleForm';
import toast from 'react-hot-toast';

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await roleService.getRoles();
      // Ensure permissions is always an array
      const formattedRoles = data.map(role => ({
        ...role,
        permissions: Array.isArray(role.permissions) ? role.permissions : []
      }));
      setRoles(formattedRoles);
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (data: any) => {
    try {
      setIsSubmitting(true);
      await roleService.createRole(data);
      toast.success('Role created successfully');
      setShowAddModal(false);
      fetchRoles();
    } catch (err) {
      toast.error('Failed to create role');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (data: any) => {
    if (!selectedRole) return;

    try {
      setIsSubmitting(true);
      await roleService.updateRole(selectedRole.id, data);
      toast.success('Role updated successfully');
      setShowEditModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (err) {
      toast.error('Failed to update role');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await roleService.deleteRole(roleId);
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (err) {
      toast.error('Failed to delete role');
      console.error(err);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Role
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <RoleForm
          onSubmit={handleCreateRole}
          onCancel={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showEditModal && selectedRole && (
        <RoleForm
          initialData={selectedRole}
          onSubmit={handleUpdateRole}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedRole(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}