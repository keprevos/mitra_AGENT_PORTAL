import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { AgencyStaff, agencyService } from '../../../api/services/agency.service';
import { PermissionGate } from '../../common/PermissionGate';
import toast from 'react-hot-toast';

export function AgentManagement() {
  const [staffList, setStaffList] = useState<AgencyStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<AgencyStaff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const data = await agencyService.getStaff();
      setStaffList(data);
    } catch (err) {
      setError('Failed to fetch staff');
      console.error(err);
      toast.error('Failed to load staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = async (data: Partial<AgencyStaff>) => {
    try {
      setIsSubmitting(true);
      await agencyService.createStaff(data);
      toast.success('Staff member created successfully');
      setShowAddModal(false);
      fetchStaff();
    } catch (err) {
      toast.error('Failed to create staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStaff = async (data: Partial<AgencyStaff>) => {
    if (!selectedStaff) return;

    try {
      setIsSubmitting(true);
      await agencyService.updateStaff(selectedStaff.id, data);
      toast.success('Staff member updated successfully');
      setShowEditModal(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (err) {
      toast.error('Failed to update staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await agencyService.deleteStaff(staffId);
      toast.success('Staff member deleted successfully');
      fetchStaff();
    } catch (err) {
      toast.error('Failed to delete staff member');
      console.error(err);
    }
  };

  const filteredStaff = staffList.filter(staff =>
    staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
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
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <PermissionGate permissions={['bank.manage_agents']}>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Staff Member
          </button>
        </PermissionGate>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {staff.firstName[0]}{staff.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {staff.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{staff.role}</div>
                  {staff.department && (
                    <div className="text-sm text-gray-500">{staff.department}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <PermissionGate permissions={['bank.manage_agents']}>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStaff(staff);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Staff Modal would go here */}
      {/* {showAddModal && (
        <StaffForm
          onSubmit={handleCreateStaff}
          onCancel={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showEditModal && selectedStaff && (
        <StaffForm
          staff={selectedStaff}
          onSubmit={handleUpdateStaff}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          isSubmitting={isSubmitting}
        />
      )} */}
    </div>
  );
}