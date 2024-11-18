import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { Agent } from '../../../types/auth';
import { agentService } from '../../../api/services/agent.service';
import { PermissionGate } from '../../common/PermissionGate';

export function AgentManagement() {
  // ... existing state and hooks ...

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* ... search and filters ... */}
        
        <PermissionGate permissions={['bank.manage_agents']}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Agent
            </button>
          </div>
        </PermissionGate>
      </div>

      {/* ... table header ... */}

      <tbody className="bg-white divide-y divide-gray-200">
        {filteredAgents.map((agent) => (
          <tr key={agent.id} className="hover:bg-gray-50">
            {/* ... agent details ... */}
            
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <PermissionGate
                permissions={['bank.manage_agents']}
                fallback={
                  <span className="text-gray-400">No actions available</span>
                }
              >
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </PermissionGate>
            </td>
          </tr>
        ))}
      </tbody>
    </div>
  );
}