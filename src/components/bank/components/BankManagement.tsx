import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Building2, Users, Shield } from 'lucide-react';
import { Bank } from '../../../types/bank';
import { Staff } from '../../../types/staff';
import { adminService } from '../../../api/services/admin.service';
import { CreateBankForm } from '../forms/CreateBankForm';
import { StaffList } from '../components/StaffList';
import { RoleAssignment } from '../components/RoleAssignment';
import { StaffRequestForm } from '../forms/StaffRequestForm';
import { useRole } from '../../../contexts/RoleContext';
import toast from 'react-hot-toast';

export function BankManagement() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStaffRequestModal, setShowStaffRequestModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = useRole();
  const canCreateStaff = hasPermission('bank.manage_staff');
  const canAssignRoles = hasPermission('bank.manage_roles');

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      fetchBankStaff(selectedBank.id);
    }
  }, [selectedBank]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBanks();
      setBanks(data);
    } catch (err) {
      setError('Failed to fetch banks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBankStaff = async (bankId: string) => {
    try {
      const staff = await adminService.getBankStaff(bankId);
      setStaffList(staff);
    } catch (err) {
      console.error('Failed to fetch bank staff:', err);
      toast.error('Failed to load bank staff');
    }
  };

  const handleCreateBank = async (data: any) => {
    try {
      setIsSubmitting(true);
      await adminService.createBank(data);
      toast.success('Bank created successfully');
      setShowAddModal(false);
      fetchBanks();
    } catch (err) {
      toast.error('Failed to create bank');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStaffRequest = async (data: any) => {
    try {
      setIsSubmitting(true);
      await adminService.createStaffRequest({
        ...data,
        bankId: selectedBank?.id,
      });
      toast.success('Staff request submitted successfully');
      setShowStaffRequestModal(false);
      fetchBankStaff(selectedBank?.id || '');
    } catch (err) {
      toast.error('Failed to submit staff request');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleAssignment = async (staffId: string, roles: string[]) => {
    try {
      await adminService.updateStaffRoles(staffId, roles);
      toast.success('Roles updated successfully');
      setShowRoleModal(false);
      if (selectedBank) {
        fetchBankStaff(selectedBank.id);
      }
    } catch (err) {
      toast.error('Failed to update roles');
      console.error(err);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setStaffList([]);
  };

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Bank
        </button>
      </div>

      {/* Bank List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBanks.map((bank) => (
              <tr 
                key={bank.id} 
                className={`hover:bg-gray-50 cursor-pointer ${selectedBank?.id === bank.id ? 'bg-indigo-50' : ''}`}
                onClick={() => handleBankSelect(bank)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                      <div className="text-sm text-gray-500">{bank.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {staffList.length} Staff Members
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bank.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bank.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStaffRequestModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Request Staff"
                    >
                      <Users className="h-5 w-5" />
                    </button>
                    {canAssignRoles && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRoleModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Manage Roles"
                      >
                        <Shield className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Staff List */}
      {selectedBank && (
        <StaffList
          staffList={staffList}
          onAssignRole={(staff) => {
            setSelectedStaff(staff);
            setShowRoleModal(true);
          }}
          canAssignRoles={canAssignRoles}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <CreateBankForm
          onSubmit={handleCreateBank}
          onCancel={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showStaffRequestModal && selectedBank && (
        <StaffRequestForm
          bankId={selectedBank.id}
          onSubmit={handleStaffRequest}
          onCancel={() => setShowStaffRequestModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showRoleModal && selectedStaff && (
        <RoleAssignment
          staff={selectedStaff}
          onSubmit={handleRoleAssignment}
          onCancel={() => {
            setShowRoleModal(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
}