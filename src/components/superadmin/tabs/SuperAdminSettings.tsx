import React from 'react';
import { Shield, Bell, Globe, Database } from 'lucide-react';

export function SuperAdminSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Security Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Global Security Settings
          </h2>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enforce-2fa"
                    name="enforce-2fa"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enforce-2fa" className="font-medium text-gray-700">
                    Enforce Two-Factor Authentication
                  </label>
                  <p className="text-gray-500">
                    Require 2FA for all bank administrators and agents
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="password-policy"
                    name="password-policy"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="password-policy" className="font-medium text-gray-700">
                    Strict Password Policy
                  </label>
                  <p className="text-gray-500">
                    Enforce complex passwords and regular password changes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Configuration
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                defaultValue="5"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Global Notification Settings
          </h2>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="security-alerts"
                    name="security-alerts"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="security-alerts" className="font-medium text-gray-700">
                    Security Alerts
                  </label>
                  <p className="text-gray-500">
                    Receive notifications about security-related events
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="system-updates"
                    name="system-updates"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="system-updates" className="font-medium text-gray-700">
                    System Updates
                  </label>
                  <p className="text-gray-500">
                    Get notified about system maintenance and updates
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