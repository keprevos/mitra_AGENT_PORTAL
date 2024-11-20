import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Bank } from '../../../types/bank';

interface BankListProps {
  banks: Bank[];
  selectedBank: Bank | null;
  onBankSelect: (bank: Bank) => void;
  onAddStaff: (bank: Bank) => void;
  staffCounts: Record<string, number>;
}

export function BankList({ banks, selectedBank, onBankSelect, onAddStaff, staffCounts }: BankListProps) {
  return (
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
          {banks.map((bank) => (
            <tr 
              key={bank.id} 
              className={`hover:bg-gray-50 cursor-pointer ${selectedBank?.id === bank.id ? 'bg-indigo-50' : ''}`}
              onClick={() => onBankSelect(bank)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                    <div className="text-sm text-gray-500">{bank.registrationNumber}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {staffCounts[bank.id] || 0} Staff Members
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  bank.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bank.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStaff(bank);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Add Staff
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}