import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Agent } from '../../../types/agent';
import { Staff } from '../../../types/staff';
import { agentService } from '../../../api/services/agent.service';
import { AgentList } from '../components/AgentList';
import { CreateAgentForm } from '../forms/CreateAgentForm';
import { CreateStaffForm } from '../forms/CreateStaffForm';
import { RoleAssignment } from '../components/RoleAssignment';
import { StaffList } from '../components/StaffList';
import { useRole } from '../../../contexts/RoleContext';
import toast from 'react-hot-toast';

export function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasPermission } = useRole();
  const canManageAgents = hasPermission('system.manage_banks');
  const canAssignRoles = hasPermission('system.manage_roles');

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      fetchAgentStaff(selectedAgent.bankId, selectedAgent.id);
    }
  }, [selectedAgent]);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgentStaff = async (bankId: string, agentId: string) => {
    try {
      const staff = await agentService.getAgentStaff(bankId, agentId);
      setStaffList(staff);
    } catch (err) {
      console.error('Failed to fetch agent staff:', err);
      toast.error('Failed to load agent staff');
    }
  };

  const handleCreateAgent = async (data: any) => {
    try {
      setIsSubmitting(true);
      await agentService.createAgent(data.bankId, data);
      toast.success('Agent created successfully');
      setShowAddAgentModal(false);
      fetchAgents();
    } catch (err) {
      toast.error('Failed to create agent');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateStaff = async (data: any) => {
    if (!selectedAgent) return;

    try {
      setIsSubmitting(true);
      await agentService.createAgentStaff(selectedAgent.bankId, selectedAgent.id, data);
      toast.success('Staff member created successfully');
      setShowAddStaffModal(false);
      fetchAgentStaff(selectedAgent.bankId, selectedAgent.id);
    } catch (err) {
      toast.error('Failed to create staff member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAgent = async (agent: Agent) => {
    // Implement edit functionality
  };

  const handleDeleteAgent = async (agent: Agent) => {
    try {
      await agentService.deleteAgent(agent.bankId, agent.id);
      toast.success('Agent deleted successfully');
      fetchAgents();
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent(null);
        setStaffList([]);
      }
    } catch (err) {
      toast.error('Failed to delete agent');
      console.error(err);
    }
  };

  const handleRoleAssignment = async (staffId: string, roles: string[]) => {
    if (!selectedAgent) return;

    try {
      await agentService.updateAgentStaffRoles(selectedAgent.bankId, selectedAgent.id, staffId, roles);
      toast.success('Roles updated successfully');
      setShowRoleModal(false);
      fetchAgentStaff(selectedAgent.bankId, selectedAgent.id);
    } catch (err) {
      toast.error('Failed to update roles');
      console.error(err);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.bankName.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canManageAgents && (
          <button
            onClick={() => setShowAddAgentModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Agent
          </button>
        )}
      </div>

      {/* Agent List */}
      <AgentList
        agents={filteredAgents}
        selectedAgent={selectedAgent}
        onAgentSelect={setSelectedAgent}
        onAddStaff={(agent) => {
          setSelectedAgent(agent);
          setShowAddStaffModal(true);
        }}
        onEditAgent={handleEditAgent}
        onDeleteAgent={handleDeleteAgent}
      />

      {/* Staff List */}
      {selectedAgent && (
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
      {showAddAgentModal && (
        <CreateAgentForm
          bankId={selectedAgent?.bankId || ''}
          onSubmit={handleCreateAgent}
          onCancel={() => setShowAddAgentModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showAddStaffModal && selectedAgent && (
        <CreateStaffForm
          onSubmit={handleCreateStaff}
          onCancel={() => setShowAddStaffModal onCancel={() => setShowAddStaffModal(false)}
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