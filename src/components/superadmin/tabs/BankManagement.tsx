import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Bank } from '../../../types/bank';
import { Staff } from '../../../types/staff';
import { adminService } from '../../../api/services/admin.service';
import { BankList } from '../components/BankList';
import { BankStaffList } from '../components/BankStaffList';
import { CreateBankForm } from '../forms/CreateBankForm';
import { CreateStaffForm } from '../forms/CreateStaffForm';
import { RoleAssignment } from '../components/RoleAssignment';
import { useRole } from '../../../contexts/RoleContext';
import toast from 'react-hot-toast';

export function BankManagement() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffCounts, setStaffCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = useRole();
  const canManageStaff = hasPermission('system.manage_banks');
  const canAssignRoles = hasPermission('system.manage_roles');

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
      // Fetch staff counts for each bank
      const counts: Record<string, number> = {};
      await Promise.all(
        data.map(async (bank) => {
          const staff = await adminService.getBankStaff(bank.id);
          counts[bank.id] = staff.length;
        })
      );
      setStaffCounts(counts);
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
      setStaffCounts(prev => ({
        ...prev,
        [bankId]: staff.length
      }));
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
      setShowAddBankModal(false);
      fetchBanks();
    } catch (err) {
      toast.error('Failed to create bank');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateStaff = async (data: any) => {
    if (!selectedBank) return;

    try {
      setIsSubmitting(true);
      await adminService.createBankStaff(selectedBank.id, data);
      toast.success('Staff member created successfully');
      setShowAddStaffModal(false);
      fetchBankStaff(selectedBank.id);
    } catch (err) {
      toast.error('Failed to create staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStaff = async (staff: Staff) => {
    if (!selectedBank) return;

    try {
      setIsSubmitting(true);
      await adminService.updateBankStaff(selectedBank.id, staff.id, staff);
      toast.success('Staff member updated successfully');
      fetchBankStaff(selectedBank.id);
    } catch (err) {
      toast.error('Failed to update staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staff: Staff) => {
    if (!selectedBank) return;

    try {
      setIsSubmitting(true);
      await adminService.deleteBankStaff(selectedBank.id, staff.id);
      toast.success('Staff member deleted successfully');
      fetchBankStaff(selectedBank.id);
    } catch (err) {
      toast.error('Failed to delete staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleAssignment = async (staffId: string, roles: string[]) => {
    if (!selectedBank) return;

    try {
      await adminService.updateStaffRoles(selectedBank.id, staffId, roles);
      toast.success('Roles updated successfully');
      setShowRoleModal(false);
      fetchBankStaff(selectedBank.id);
    } catch (err) {
      toast.error('Failed to update roles');
      console.error(err);
    }
  };

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => setShowAddBankModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Bank
        </button>
      </div>

      {/* Bank List */}
      <BankList
        banks={filteredBanks}
        selectedBank={selectedBank}
        onBankSelect={setSelectedBank}
        onAddStaff={(bank) => {
          setSelectedBank(bank);
          setShowAddStaffModal(true);
        }}
        staffCounts={staffCounts}
      />

      {/* Staff List */}
      {selectedBank && (
        <BankStaffList
          staffList={staffList}
          onAssignRole={(staff) => {
            setSelectedStaff(staff);
            setShowRoleModal(true);
          }}
          onAddStaff={() => setShowAddStaffModal(true)}
          onEditStaff={handleEditStaff}
          onDeleteStaff={handleDeleteStaff}
          canAssignRoles={canAssignRoles}
          bankName={selectedBank.name}
        />
      )}

      {/* Modals */}
      {showAddBankModal && (
        <CreateBankForm
          onSubmit={handleCreateBank}
          onCancel={() => setShowAddBankModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showAddStaffModal && selectedBank && (
        <CreateStaffForm
          onSubmit={handleCreateStaff}
          onCancel={() => setShowAddStaffModal(false)}
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