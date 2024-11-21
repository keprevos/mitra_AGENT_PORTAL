import React from 'react';
import { Shield, Bell, Building2, Globe } from 'lucide-react';

export function AgencySettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Agency Profile Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Agency Profile
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Agency Name
              </label>
              <input
                type="text"
                defaultValue="Example Agency"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                defaultValue="AG123456789"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                defaultValue="123 Agency Street, Business District"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
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
                    Enable two-factor authentication for all agency staff
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

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </h2>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="customer-notifications"
                    name="customer-notifications"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="customer-notifications" className="font-medium text-gray-700">
                    Customer Activity Notifications
                  </label>
                  <p className="text-gray-500">
                    Receive notifications about important customer activities
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="transaction-alerts"
                    name="transaction-alerts"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="transaction-alerts" className="font-medium text-gray-700">
                    Transaction Alerts
                  </label>
                  <p className="text-gray-500">
                    Get notified about important transaction events
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