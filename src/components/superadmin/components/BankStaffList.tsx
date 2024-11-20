import React, { useState } from 'react';
import { Shield, Mail, Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { Staff } from '../../../types/staff';

interface BankStaffListProps {
  staffList: Staff[];
  onAssignRole: (staff: Staff) => void;
  onAddStaff: () => void;
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (staff: Staff) => void;
  canAssignRoles: boolean;
  bankName: string;
}

export function BankStaffList({ 
  staffList, 
  onAssignRole, 
  onAddStaff, 
  onEditStaff,
  onDeleteStaff,
  canAssignRoles, 
  bankName 
}: BankStaffListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Staff Members</h3>
          <p className="mt-1 text-sm text-gray-500">{bankName}</p>
        </div>
        <button
          onClick={onAddStaff}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </button>
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
                <div className="flex items-center space-x-2">
                  {canAssignRoles && (
                    <button
                      onClick={() => onAssignRole(staff)}
                      className="p-1 text-indigo-600 hover:text-indigo-900"
                      title="Assign Roles"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEditStaff(staff)}
                    className="p-1 text-blue-600 hover:text-blue-900"
                    title="Edit Staff"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {deleteConfirm === staff.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onDeleteStaff(staff);
                          setDeleteConfirm(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-900"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(staff.id)}
                      className="p-1 text-red-600 hover:text-red-900"
                      title="Delete Staff"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
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