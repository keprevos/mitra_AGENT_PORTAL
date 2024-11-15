import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';

const users = [
  { id: 1, name: 'John Smith', email: 'john@example.com', status: 'Completed', date: '2024-03-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'In Progress', date: '2024-03-14' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', status: 'Pending', date: '2024-03-13' },
];

export function EndUserManagement() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <OnboardingWizard onClose={() => setShowWizard(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search end-users..."
          />
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            Filter
          </button>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New End-User
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-indigo-600 truncate">{user.name}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">({user.email})</p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>Created on {user.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0">
                    <div className={`
                      inline-flex rounded-full px-2 text-xs font-semibold leading-5
                      ${user.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        user.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {user.status}
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}