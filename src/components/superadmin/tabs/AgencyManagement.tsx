import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Agency } from '../../../types/agency';
import { Bank } from '../../../types/bank';
import { Staff } from '../../../types/staff';
import { agencyService } from '../../../api/services/agency.service';
import { adminService } from '../../../api/services/admin.service';
import { AgencyList } from '../components/AgencyList';
import { CreateAgencyForm } from '../forms/CreateAgencyForm';
import { CreateStaffForm } from '../forms/CreateStaffForm';
import { RoleAssignment } from '../components/RoleAssignment';
import { StaffList } from '../components/StaffList';
import { useRole } from '../../../contexts/RoleContext';
import toast from 'react-hot-toast';

export function AgencyManagement() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAgencyModal, setShowAddAgencyModal] = useState(false);
  const [showEditAgencyModal, setShowEditAgencyModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = useRole();
  const canManageAgencies = hasPermission('system.manage_banks');
  const canAssignRoles = hasPermission('system.manage_roles');

  useEffect(() => {
    fetchBanks();
    fetchAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgency) {
      fetchAgencyStaff(selectedAgency.bankId, selectedAgency.id);
    }
  }, [selectedAgency]);

  const fetchBanks = async () => {
    try {
      const data = await adminService.getBanks();
      setBanks(data);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
      toast.error('Failed to load banks');
    }
  };

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      let data: Agency[];
      
      if (bankFilter !== 'all') {
        // Fetch agencies for specific bank
        data = await agencyService.getAgencies(bankFilter);
      } else {
        // Fetch all agencies
        data = await agencyService.getAllAgencies();
      }
      
      setAgencies(data);
    } catch (err) {
      setError('Failed to fetch agencies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch agencies when bank filter changes
  useEffect(() => {
    fetchAgencies();
  }, [bankFilter]);

  const fetchAgencyStaff = async (bankId: string, agencyId: string) => {
    try {
      const staff = await agencyService.getAgencyStaff(bankId, agencyId);
      setStaffList(staff);
    } catch (err) {
      console.error('Failed to fetch agency staff:', err);
      toast.error('Failed to load agency staff');
    }
  };

  const handleCreateAgency = async (data: any) => {
    try {
      setIsSubmitting(true);
      await agencyService.createAgency(data.bankId, data);
      toast.success('Agency created successfully');
      setShowAddAgencyModal(false);
      fetchAgencies();
    } catch (err) {
      toast.error('Failed to create agency');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAgency = async (data: any) => {
    if (!selectedAgency) return;

    try {
      setIsSubmitting(true);
      await agencyService.updateAgency(selectedAgency.bankId, selectedAgency.id, data);
      toast.success('Agency updated successfully');
      setShowEditAgencyModal(false);
      setSelectedAgency(null);
      fetchAgencies();
    } catch (err) {
      toast.error('Failed to update agency');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAgency = async (agency: Agency) => {
    try {
      await agencyService.deleteAgency(agency.bankId, agency.id);
      toast.success('Agency deleted successfully');
      fetchAgencies();
      if (selectedAgency?.id === agency.id) {
        setSelectedAgency(null);
        setStaffList([]);
      }
    } catch (err) {
      toast.error('Failed to delete agency');
      console.error(err);
    }
  };

  const handleCreateStaff = async (data: any) => {
    if (!selectedAgency) return;

    try {
      setIsSubmitting(true);
      await agencyService.createAgencyStaff(selectedAgency.bankId, selectedAgency.id, data);
      toast.success('Staff member created successfully');
      setShowAddStaffModal(false);
      fetchAgencyStaff(selectedAgency.bankId, selectedAgency.id);
    } catch (err) {
      toast.error('Failed to create staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleAssignment = async (staffId: string, roles: string[]) => {
    if (!selectedAgency) return;

    try {
      await agencyService.updateAgencyStaffRoles(selectedAgency.bankId, selectedAgency.id, staffId, roles);
      toast.success('Roles updated successfully');
      setShowRoleModal(false);
      fetchAgencyStaff(selectedAgency.bankId, selectedAgency.id);
    } catch (err) {
      toast.error('Failed to update roles');
      console.error(err);
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.bankName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
            placeholder="Search agencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
          >
            <option value="all">All Banks</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>{bank.name}</option>
            ))}
          </select>
          {canManageAgencies && (
            <button
              onClick={() => setShowAddAgencyModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Agency
            </button>
          )}
        </div>
      </div>

      {/* Agency List */}
      <AgencyList
        agencies={filteredAgencies}
        selectedAgency={selectedAgency}
        onAgencySelect={setSelectedAgency}
        onAddStaff={(agency) => {
          setSelectedAgency(agency);
          setShowAddStaffModal(true);
        }}
        onEditAgency={(agency) => {
          setSelectedAgency(agency);
          setShowEditAgencyModal(true);
        }}
        onDeleteAgency={handleDeleteAgency}
      />

      {/* Staff List */}
      {selectedAgency && (
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
      {showAddAgencyModal && (
        <CreateAgencyForm
          banks={banks}
          onSubmit={handleCreateAgency}
          onCancel={() => setShowAddAgencyModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showEditAgencyModal && selectedAgency && (
        <CreateAgencyForm
          banks={banks}
          initialData={selectedAgency}
          onSubmit={handleEditAgency}
          onCancel={() => setShowEditAgencyModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showAddStaffModal && selectedAgency && (
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