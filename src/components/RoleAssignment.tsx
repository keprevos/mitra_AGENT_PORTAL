import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Staff } from '../../../types/staff';

interface RoleAssignmentProps {
  staff: Staff;
  onSubmit: (staffId: string, roles: string[]) => Promise<void>;
  onCancel: () => void;
}

const AVAILABLE_ROLES = {
  bank_staff: [
    'view_requests',
    'approve_requests',
    'manage_documents',
    'view_reports'
  ],
  bank_admin: [
    'manage_staff',
    'manage_agents',
    'manage_settings',
    'view_reports',
    'approve_requests'
  ],
  agent_staff: [
    'create_requests',
    'view_own_requests',
    'manage_documents'
  ],
  agent_admin: [
    'manage_staff',
    'view_all_requests',
    'manage_settings',
    'approve_requests'
  ]
};

export function RoleAssignment({ staff, onSubmit, onCancel }: RoleAssignmentProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(staff.permissions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(staff.id, selectedRoles);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Assign Roles - {staff.firstName} {staff.lastName}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {Object.entries(AVAILABLE_ROLES).map(([roleGroup, permissions]) => (
              <div key={roleGroup} className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 capitalize">
                  {roleGroup.replace('_', ' ')} Permissions
                </h4>
                <div className="space-y-2">
                  {permissions.map(permission => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(permission)}
                        onChange={() => toggleRole(permission)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {permission.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
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
              {isSubmitting ? 'Saving...' : 'Save Roles'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}