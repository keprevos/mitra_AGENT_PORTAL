import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield, Users } from 'lucide-react';
import { Staff, StaffRequest } from '../../../types/staff';
import { staffService } from '../../../api/services/staff.service';
import { RoleAssignment } from '../components/RoleAssignment';
import { StaffRequestForm } from '../forms/StaffRequestForm';
import { StaffList } from '../components/StaffList';
import { useRole } from '../../../contexts/RoleContext';
import toast from 'react-hot-toast';

export function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = useRole();
  const canCreateStaff = hasPermission('bank.create_staff');
  const canAssignRoles = hasPermission('bank.assign_roles');

  useEffect(() => {
    fetchStaffAndRequests();
  }, []);

  const fetchStaffAndRequests = async () => {
    try {
      setIsLoading(true);
      const [staffData, requestsData] = await Promise.all([
        staffService.getStaff(localStorage.getItem('bankId') || ''),
        staffService.getStaffRequests(localStorage.getItem('bankId') || ''),
      ]);
      setStaffList(staffData);
      setRequests(requestsData);
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
      toast.error('Failed to load staff data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (data: any) => {
    try {
      setIsSubmitting(true);
      await staffService.createStaffRequest({
        ...data,
        bankId: localStorage.getItem('bankId'),
      });
      toast.success('Staff request submitted successfully');
      setShowRequestModal(false);
      fetchStaffAndRequests();
    } catch (err) {
      console.error('Failed to submit request:', err);
      toast.error('Failed to submit staff request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleUpdate = async (staffId: string, role: string, permissions: string[]) => {
    try {
      await staffService.updateStaffRole(staffId, role, permissions);
      toast.success('Role updated successfully');
      setShowRoleModal(false);
      fetchStaffAndRequests();
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error('Failed to update role');
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
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          {canCreateStaff ? 'Add Staff' : 'Request Staff'}
        </button>
      </div>

      {/* Pending Requests Section */}
      {requests.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Pending Requests
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div key={request.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {request.details.firstName} {request.details.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{request.details.role}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff List */}
      <StaffList
        staffList={filteredStaff}
        onAssignRole={(staff) => {
          setSelectedStaff(staff);
          setShowRoleModal(true);
        }}
        canAssignRoles={canAssignRoles}
      />

      {/* Modals */}
      {showRequestModal && (
        <StaffRequestForm
          onSubmit={handleCreateRequest}
          onCancel={() => setShowRequestModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showRoleModal && selectedStaff && (
        <RoleAssignment
          staff={selectedStaff}
          onSubmit={handleRoleUpdate}
          onCancel={() => {
            setShowRoleModal(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
}