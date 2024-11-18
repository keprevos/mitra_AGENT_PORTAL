import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Building2, Users, FileText } from 'lucide-react';
import { Bank } from '../../../types/auth';
import { superAdminService, CreateBankDto } from '../../../api/services/superadmin.service';
import { BankForm } from '../forms/BankForm';

export function BankManagement() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getBanks();
      setBanks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banks';
      setError(errorMessage);
      console.error('Banks fetch error:', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBank = async (data: CreateBankDto) => {
    try {
      setIsSubmitting(true);
      await superAdminService.createBank(data);
      setShowAddModal(false);
      fetchBanks();
    } catch (err) {
      console.error('Failed to create bank:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBank = async (data: CreateBankDto) => {
    if (!selectedBank) return;

    try {
      setIsSubmitting(true);
      await superAdminService.updateBank(selectedBank.id, {
        name: data.name,
        registrationNumber: data.registrationNumber,
        address: data.address,
      });
      setSelectedBank(null);
      fetchBanks();
    } catch (err) {
      console.error('Failed to update bank:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!window.confirm('Are you sure you want to delete this bank?')) return;

    try {
      await superAdminService.deleteBank(bankId);
      fetchBanks();
    } catch (err) {
      console.error('Failed to delete bank:', err);
    }
  };

  const handleStatusToggle = async (bank: Bank) => {
    try {
      await superAdminService.updateBank(bank.id, {
        status: bank.status === 'active' ? 'inactive' : 'active'
      });
      fetchBanks();
    } catch (err) {
      console.error('Failed to update bank status:', err);
    }
  };

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bank.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Bank
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">{error}</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanks.map((bank) => (
                <tr key={bank.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="h-10 w-10 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                        <div className="text-sm text-gray-500">{bank.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bank.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(bank)}
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${bank.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }
                      `}
                    >
                      {bank.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {bank.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{bank.totalAgents} agents</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{bank.totalRequests} requests</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bank.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedBank(bank)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBank(bank.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Bank Modal */}
      {(showAddModal || selectedBank) && (
        <BankForm
          onSubmit={selectedBank ? handleUpdateBank : handleCreateBank}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedBank(null);
          }}
          initialData={selectedBank || undefined}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}