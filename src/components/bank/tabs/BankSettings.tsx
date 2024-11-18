import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Bell, Lock, Building, Globe } from 'lucide-react';

export function BankSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Bank Profile Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Bank Profile
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                defaultValue="Example Bank"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                defaultValue="123456789"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                defaultValue="123 Banking Street, Financial District"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Security Settings
          </h2>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="two-factor"
                    name="two-factor"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="two-factor" className="font-medium text-gray-700">
                    Two-factor authentication
                  </label>
                  <p className="text-gray-500">
                    Enable two-factor authentication for all bank administrators
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="session-timeout"
                    name="session-timeout"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="session-timeout" className="font-medium text-gray-700">
                    Automatic session timeout
                  </label>
                  <p className="text-gray-500">
                    Automatically log out users after 30 minutes of inactivity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </h2>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="new-requests"
                    name="new-requests"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="new-requests" className="font-medium text-gray-700">
                    New request notifications
                  </label>
                  <p className="text-gray-500">
                    Receive notifications when new end-user requests are submitted
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agent-activity"
                    name="agent-activity"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agent-activity" className="font-medium text-gray-700">
                    Agent activity alerts
                  </label>
                  <p className="text-gray-500">
                    Get notified about important agent activities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}