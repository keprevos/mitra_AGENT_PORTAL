import React from 'react';
import { Shield, Mail, Clock } from 'lucide-react';
import { Staff } from '../../../types/staff';

interface StaffListProps {
  staffList: Staff[];
  onAssignRole: (staff: Staff) => void;
  canAssignRoles: boolean;
}

export function StaffList({ staffList, onAssignRole, canAssignRoles }: StaffListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Staff Members</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {staffList.map((staff) => (
          <div key={staff.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {staff.firstName[0]}{staff.lastName[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {staff.firstName} {staff.lastName}
                  </h4>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{staff.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">{staff.role}</span>
                  {staff.lastLogin && (
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Last login: {new Date(staff.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {canAssignRoles && (
                  <button
                    onClick={() => onAssignRole(staff)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {staffList.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500">
            No staff members found
          </div>
        )}
      </div>
    </div>
  );
}