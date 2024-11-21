import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Role } from '../../../api/services/role.service';

const roleSchema = z.object({
  name: z.string().min(2, 'Role name is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

type RoleFormInputs = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormInputs) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Predefined permission categories
const PERMISSION_CATEGORIES = {
  system: [
    'system.manage_roles',
    'system.manage_banks',
    'system.view_audit_logs',
  ],
  bank: [
    'bank.manage_staff',
    'bank.manage_agents',
    'bank.view_reports',
    'bank.manage_settings',
  ],
  agency: [
    'agency.manage_staff',
    'agency.manage_customers',
    'agency.view_reports',
    'agency.process_transactions',
  ],
};

export function RoleForm({ initialData, onSubmit, onCancel, isSubmitting }: RoleFormProps) {
  const [customPermission, setCustomPermission] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormInputs>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions');

  const handleAddCustomPermission = () => {
    if (customPermission && !selectedPermissions.includes(customPermission)) {
      setValue('permissions', [...selectedPermissions, customPermission]);
      setCustomPermission('');
    }
  };

  const handleRemovePermission = (permission: string) => {
    setValue(
      'permissions',
      selectedPermissions.filter((p) => p !== permission)
    );
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Role' : 'Create New Role'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., bank_admin"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>

            {/* Permission Categories */}
            <div className="space-y-4">
              {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                    {category} Permissions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          value={permission}
                          {...register('permissions')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.split('.')[1].replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Permission Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Custom Permission
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customPermission}
                  onChange={(e) => setCustomPermission(e.target.value)}
                  placeholder="e.g., custom.permission"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCustomPermission}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Selected Permissions */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Permissions
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPermissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {permission}
                    <button
                      type="button"
                      onClick={() => handleRemovePermission(permission)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {errors.permissions && (
              <p className="mt-1 text-sm text-red-600">{errors.permissions.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Role')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}