import React, { useState } from 'react';
import { Building2, Users, Edit2, Trash2 } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AgencyListProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onAgencySelect: (agency: Agency) => void;
  onAddStaff: (agency: Agency) => void;
  onEditAgency: (agency: Agency) => void;
  onDeleteAgency: (agency: Agency) => void;
}

export function AgencyList({ 
  agencies, 
  selectedAgency, 
  onAgencySelect, 
  onAddStaff,
  onEditAgency,
  onDeleteAgency
}: AgencyListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agency Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bank
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
          {agencies.map((agency) => (
            <tr 
              key={agency.id} 
              className={`hover:bg-gray-50 cursor-pointer ${selectedAgency?.id === agency.id ? 'bg-indigo-50' : ''}`}
              onClick={() => onAgencySelect(agency)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                    <div className="text-sm text-gray-500">{agency.code}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {agency.bankName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {agency.staffCount || 0} Staff Members
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  agency.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {agency.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddStaff(agency);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Add Staff"
                  >
                    <Users className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAgency(agency);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit Agency"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  {deleteConfirm === agency.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAgency(agency);
                          setDeleteConfirm(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-900"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(null);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(agency.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Agency"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}