import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../contexts/RoleContext';
import { LogOut, Settings, Bell } from 'lucide-react';
import { PermissionGate } from '../common/PermissionGate';

export function DashboardNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <div className="ml-4 font-semibold text-gray-900">Agent Portal</div>
          </div>

          <div className="flex items-center space-x-4">
            <PermissionGate permissions={['system.view_audit_logs']}>
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
            </PermissionGate>

            <PermissionGate
              permissions={[
                'system.manage_banks',
                'bank.manage_agents',
                'bank.manage_staff'
              ]}
              requireAll={false}
            >
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
            </PermissionGate>

            <span className="text-gray-700">
              Welcome, {user?.firstName} {user?.lastName}
            </span>

            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}