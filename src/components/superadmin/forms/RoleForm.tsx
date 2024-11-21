import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Role, Permission } from '../../../api/services/role.service';

const roleSchema = z.object({
  name: z.string().min(2, 'Role name is required'),
  group: z.string().min(2, 'Group is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

type RoleFormInputs = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: Role | null;
  permissions: Permission[];
  groupedPermissions: Record<string, Permission[]>;
  onSubmit: (data: RoleFormInputs) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RoleForm({
  initialData,
  permissions,
  groupedPermissions,
  onSubmit,
  onCancel,
  isSubmitting
}: RoleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormInputs>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData ? {
      ...initialData,
      permissions: initialData.permissions.map(p => p.id)
    } : {
      group: 'other',
      permissions: []
    }
  });

  const selectedPermissions = watch('permissions');
  const isEditing = !!initialData;
  const isSystemRole = initialData?.name && ['super_admin', 'bank_admin', 'bank_staff', 'agency_admin', 'agent_staff'].includes(initialData.name);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        {/* Header - Fixed at top */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Role' : 'Create New Role'}
            </h3>
            <button 
              onClick={onCancel} 
              className="text-gray-400 hover:text-gray-500 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  disabled={isSystemRole}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group
                </label>
                <select
                  {...register('group')}
                  disabled={isSystemRole}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                >
                  <option value="system">System</option>
                  <option value="bank">Bank</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
                {errors.group && (
                  <p className="mt-1 text-sm text-red-600">{errors.group.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Permissions
              </label>
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                      {category} Permissions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categoryPermissions.map((permission) => (
                        <label key={permission.id} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              value={permission.id}
                              disabled={isSystemRole}
                              {...register('permissions')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-700">
                              {permission.name}
                            </span>
                            {permission.description && (
                              <p className="text-xs text-gray-500">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.permissions && (
                <p className="mt-2 text-sm text-red-600">{errors.permissions.message}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isSystemRole}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}